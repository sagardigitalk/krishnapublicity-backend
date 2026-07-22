import Expense from '../models/Expense.js';
import Settings from '../models/Settings.js';
import PDFDocument from 'pdfkit-table';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getExpenses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    let query = {};
    if (req.query.startDate && req.query.endDate && req.query.startDate !== 'undefined') {
      // Expense date is stored as YYYY-MM-DD string
      query.date = { 
        $gte: req.query.startDate, 
        $lte: req.query.endDate 
      };
    }

    const totalRecords = await Expense.countDocuments(query);
    const expenses = await Expense.find(query).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
    
    const totals = await Expense.aggregate([
      { $match: query },
      { $group: { _id: null, totalBill: { $sum: "$totalBill" }, totalGiven: { $sum: "$givenAmount" }, totalPending: { $sum: "$pendingAmount" } } }
    ]);
    
    const totalBill = totals.length > 0 ? totals[0].totalBill : 0;
    const totalGiven = totals.length > 0 ? totals[0].totalGiven : 0;
    const totalPending = totals.length > 0 ? totals[0].totalPending : 0;
    
    res.status(200).json({
      data: expenses,
      totalRecords,
      totalBill,
      totalGiven,
      totalPending,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: page,
      pageSize: limit
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expense records', error: error.message });
  }
};

export const createExpense = async (req, res) => {
  try {
    const count = await Expense.countDocuments();
    const billNumber = (count + 1).toString();
    const expenseData = { ...req.body, billNumber };
    const expense = new Expense(expenseData);
    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(500).json({ message: 'Error creating expense record', error: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    await Expense.findByIdAndDelete(id);
    res.status(200).json({ message: 'Expense record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expense record', error: error.message });
  }
};

export const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findById(id);
    if (!expense) return res.status(404).json({ message: 'Expense record not found' });
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expense record', error: error.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedExpense) return res.status(404).json({ message: 'Expense record not found' });
    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: 'Error updating expense record', error: error.message });
  }
};

import { drawReportHeader } from '../utils/reportPdfGenerator.js';

export const downloadExpenseReportPDF = async (req, res) => {
  try {
    let query = {};
    if (req.query.startDate && req.query.endDate && req.query.startDate !== 'undefined') {
      query.date = { $gte: req.query.startDate, $lte: req.query.endDate };
    }

    const expenses = await Expense.find(query).sort({ createdAt: -1 });
    const settings = await Settings.findOne() || {};

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=expense-report-${Date.now()}.pdf`);
    doc.pipe(res);

    const primaryGreen = '#2ea354';
    const primaryRed = '#e60000';

    let periodText = 'All Time';
    if (req.query.startDate && req.query.endDate) {
      periodText = `${req.query.startDate} to ${req.query.endDate}`;
    }

    drawReportHeader(doc, 'EXPENSE REPORT', periodText, settings);

    const totalBill = expenses.reduce((sum, exp) => sum + (exp.totalBill || 0), 0);
    const totalGiven = expenses.reduce((sum, exp) => sum + (exp.givenAmount || 0), 0);
    const totalPending = expenses.reduce((sum, exp) => sum + (exp.pendingAmount || 0), 0);

    const table = {
      headers: ["Voucher No.", "Date", "Printing Press", "Details", "Total", "Paid", "Pending"],
      rows: [
        ...expenses.map(exp => [
          exp.billNumber || '-',
          exp.date || '-',
          exp.printingPress || '-',
          exp.details || '-',
          `Rs. ${exp.totalBill || 0}`,
          `Rs. ${exp.givenAmount || 0}`,
          `Rs. ${exp.pendingAmount || 0}`
        ]),
        ['', '', '', '', '', 'Total Expense:', `Rs. ${totalBill}`],
        ['', '', '', '', '', 'Total Paid:', `Rs. ${totalGiven}`],
        ['', '', '', '', '', 'Total Pending:', `Rs. ${totalPending}`]
      ]
    };

    // Ensure table uses the whole width
    const tableTop = doc.y;
    doc.strokeColor(primaryGreen);
    
    let colXs = [];
    let headerBottomY = 0;
    let summaryStartY = 0;
    
    await doc.table(table, {
      x: 25,
      y: tableTop,
      width: 545,
      padding: 5,
      divider: {
        header: { disabled: false, width: 1, opacity: 1 },
        horizontal: { disabled: false, width: 1, opacity: 1 },
        vertical: { disabled: true }
      },
      prepareHeader: () => {
        // Draw green background for header
        doc.rect(25, doc.y, 545, 20).fill(primaryGreen);
        doc.font("Helvetica-Bold").fontSize(10).fillColor('#ffffff');
      },
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        if (indexRow === 0) {
          colXs[indexColumn] = rectCell.x + rectCell.width;
          headerBottomY = rectCell.y;
        }
        if (indexRow === expenses.length && indexColumn === 0) {
          summaryStartY = rectCell.y;
        }

        // Alternating row background
        if (indexColumn === 0) {
          if (indexRow % 2 === 0) doc.addBackground(rectRow, '#f0f9f0', 1);
        }
        
        // Draw inner vertical borders manually
        if (indexColumn < 6) {
          doc.moveTo(rectCell.x + rectCell.width, rectCell.y)
             .lineTo(rectCell.x + rectCell.width, rectCell.y + rectCell.height)
             .lineWidth(1).strokeColor(primaryGreen).stroke();
        }
        
        // Font styles
        if (indexRow === expenses.length) doc.font("Helvetica-Bold").fontSize(9).fillColor('#000000');
        else if (indexRow === expenses.length + 1) doc.font("Helvetica-Bold").fontSize(9).fillColor(primaryGreen);
        else if (indexRow === expenses.length + 2) doc.font("Helvetica-Bold").fontSize(9).fillColor(primaryRed);
        else doc.font("Helvetica").fontSize(9).fillColor('#333333');
      }
    });

    // Draw header vertical lines in white
    colXs.forEach((x, i) => {
      if (i < 6) {
        doc.moveTo(x, tableTop).lineTo(x, headerBottomY).lineWidth(1).strokeColor('#ffffff').stroke();
      }
    });

    if (summaryStartY > 0) {
      // Erase lines in the empty block (columns 0 to 4)
      doc.rect(26, summaryStartY + 1, colXs[4] - 26, doc.y - summaryStartY - 1).fill('#ffffff');
      // Redraw the separating vertical line just in case it got clipped
      doc.moveTo(colXs[4], summaryStartY).lineTo(colXs[4], doc.y).lineWidth(1).strokeColor(primaryGreen).stroke();
    }

    // Draw the outer table border
    doc.rect(25, tableTop, 545, doc.y - tableTop).lineWidth(1).strokeColor(primaryGreen).stroke();

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating PDF', error: error.message });
  }
};

export const downloadExpenseBillPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findById(id);
    if (!expense) return res.status(404).json({ message: 'Expense record not found' });

    const settings = await Settings.findOne() || {};

    const doc = new PDFDocument({ margin: 0, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Expense-Voucher-${expense.billNumber || id}.pdf`);
    doc.pipe(res);

    const data = {
      billNumber: expense.billNumber || '1',
      date: expense.date ? expense.date.split('-').reverse().join('-') : new Date().toISOString().slice(0, 10).split('-').reverse().join('-'),
      customerId: 'EXP-101',
      partyType: 'VENDOR / PAY TO',
      partyName: expense.printingPress || 'Vendor',
      partyAddress: '',
      partyGst: '',
      subject: 'Expense / Payment',
      details: expense.details || 'Expense Details',
      amount: expense.totalBill || 0
    };

    generateProformaInvoice(doc, data, settings);

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating PDF bill', error: error.message });
  }
};
