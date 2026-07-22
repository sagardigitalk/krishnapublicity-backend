import Income from '../models/Income.js';
import Settings from '../models/Settings.js';
import PDFDocument from 'pdfkit-table';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getIncomes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    let query = {};
    if (req.query.startDate && req.query.endDate && req.query.startDate !== 'undefined') {
      // Income date is stored as YYYY-MM-DD string
      query.date = { 
        $gte: req.query.startDate, 
        $lte: req.query.endDate 
      };
    }

    const totalRecords = await Income.countDocuments(query);
    const incomes = await Income.find(query).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
    
    const totals = await Income.aggregate([
      { $match: query },
      { $group: { _id: null, totalBill: { $sum: "$totalBill" }, totalGiven: { $sum: "$givenAmount" }, totalPending: { $sum: "$pendingAmount" } } }
    ]);
    
    const totalBill = totals.length > 0 ? totals[0].totalBill : 0;
    const totalGiven = totals.length > 0 ? totals[0].totalGiven : 0;
    const totalPending = totals.length > 0 ? totals[0].totalPending : 0;
    
    res.status(200).json({
      data: incomes,
      totalRecords,
      totalBill,
      totalGiven,
      totalPending,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: page,
      pageSize: limit
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching income records', error: error.message });
  }
};

export const createIncome = async (req, res) => {
  try {
    const count = await Income.countDocuments();
    const billNumber = (count + 1).toString();

    const incomeData = { ...req.body, billNumber };
    const income = new Income(incomeData);
    const savedIncome = await income.save();
    res.status(201).json(savedIncome);
  } catch (error) {
    res.status(500).json({ message: 'Error creating income record', error: error.message });
  }
};

export const deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;
    await Income.findByIdAndDelete(id);
    res.status(200).json({ message: 'Income record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting income record', error: error.message });
  }
};

export const getIncomeById = async (req, res) => {
  try {
    const { id } = req.params;
    const income = await Income.findById(id);
    if (!income) return res.status(404).json({ message: 'Income record not found' });
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching income record', error: error.message });
  }
};

export const updateIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedIncome = await Income.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedIncome) return res.status(404).json({ message: 'Income record not found' });
    res.status(200).json(updatedIncome);
  } catch (error) {
    res.status(500).json({ message: 'Error updating income record', error: error.message });
  }
};

import { drawReportHeader } from '../utils/reportPdfGenerator.js';

export const downloadIncomeReportPDF = async (req, res) => {
  try {
    let query = {};
    if (req.query.startDate && req.query.endDate && req.query.startDate !== 'undefined') {
      query.date = { $gte: req.query.startDate, $lte: req.query.endDate };
    }

    const incomes = await Income.find(query).sort({ createdAt: -1 });
    const settings = await Settings.findOne() || {};

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Income-Report-${Date.now()}.pdf`);
    doc.pipe(res);

    const primaryGreen = '#2ea354';
    const primaryRed = '#e60000';

    let periodText = 'All Time';
    if (req.query.startDate && req.query.endDate) {
      periodText = `${req.query.startDate} to ${req.query.endDate}`;
    }

    drawReportHeader(doc, 'INCOME REPORT', periodText, settings);

    const totalBill = incomes.reduce((sum, inc) => sum + (inc.totalBill || 0), 0);
    const totalGiven = incomes.reduce((sum, inc) => sum + (inc.givenAmount || 0), 0);
    const totalPending = incomes.reduce((sum, inc) => sum + (inc.pendingAmount || 0), 0);

    const table = {
      headers: ["Bill No.", "Date", "Customer", "Product", "Total", "Given", "Pending"],
      rows: [
        ...incomes.map(inc => [
          inc.billNumber || '-',
          inc.date ? inc.date.split('-').reverse().join('-') : '-',
          inc.customerName || '-',
          inc.productName || '-',
          `Rs. ${inc.totalBill || 0}`,
          `Rs. ${inc.givenAmount || 0}`,
          `Rs. ${inc.pendingAmount || 0}`
        ]),
        ['', '', '', '', '', 'Total Billed:', `Rs. ${totalBill}`],
        ['', '', '', '', '', 'Total Received:', `Rs. ${totalGiven}`],
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
        if (indexRow === incomes.length && indexColumn === 0) {
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
        if (indexRow === incomes.length) doc.font("Helvetica-Bold").fontSize(9).fillColor('#000000');
        else if (indexRow === incomes.length + 1) doc.font("Helvetica-Bold").fontSize(9).fillColor(primaryGreen);
        else if (indexRow === incomes.length + 2) doc.font("Helvetica-Bold").fontSize(9).fillColor(primaryRed);
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

import { generateProformaInvoice } from '../utils/invoicePdfGenerator.js';

export const downloadIncomeBillPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const income = await Income.findById(id);
    if (!income) return res.status(404).json({ message: 'Income record not found' });

    const settings = await Settings.findOne() || {};

    const doc = new PDFDocument({ margin: 0, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Bill-${income.billNumber || id}.pdf`);
    doc.pipe(res);

    const data = {
      billNumber: income.billNumber || '1',
      date: income.date ? income.date.split('-').reverse().join('-') : new Date().toISOString().slice(0, 10).split('-').reverse().join('-'),
      customerId: '25', // Static as per request
      partyType: 'CUSTOMER',
      partyName: income.customerName || 'Customer Name',
      partyAddress: 'Address Details Not Available',
      partyGst: '',
      subject: income.productName || 'Advertising Services',
      details: income.details || income.productName || 'Advertising',
      amount: income.totalBill || 0
    };

    generateProformaInvoice(doc, data, settings);

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating PDF bill', error: error.message });
  }
};
