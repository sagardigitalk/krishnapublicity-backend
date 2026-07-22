import Printing from '../models/Printing.js';
import Settings from '../models/Settings.js';
import PDFDocument from 'pdfkit-table';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getPrintings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    let query = {};
    if (req.query.startDate && req.query.endDate && req.query.startDate !== 'undefined') {
      // Printing uses createdAt Date objects, so we need to parse the string dates to true Dates
      const start = new Date(req.query.startDate);
      start.setHours(0,0,0,0);
      const end = new Date(req.query.endDate);
      end.setHours(23,59,59,999);
      
      query.createdAt = { 
        $gte: start, 
        $lte: end 
      };
    }

    const totalRecords = await Printing.countDocuments(query);
    const printings = await Printing.find(query).sort({ createdAt: -1 }).skip(startIndex).limit(limit);
    
    const totals = await Printing.aggregate([
      { $match: query },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
    ]);
    
    const totalAmount = totals.length > 0 ? totals[0].totalAmount : 0;
    
    res.status(200).json({
      data: printings,
      totalRecords,
      totalAmount,
      totalPages: Math.ceil(totalRecords / limit),
      currentPage: page,
      pageSize: limit
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching printing records', error: error.message });
  }
};

export const createPrinting = async (req, res) => {
  try {
    const count = await Printing.countDocuments();
    const billNumber = (count + 1).toString();
    const printingData = { ...req.body, billNumber };
    const printing = new Printing(printingData);
    const savedPrinting = await printing.save();
    res.status(201).json(savedPrinting);
  } catch (error) {
    res.status(500).json({ message: 'Error creating printing record', error: error.message });
  }
};

export const deletePrinting = async (req, res) => {
  try {
    const { id } = req.params;
    await Printing.findByIdAndDelete(id);
    res.status(200).json({ message: 'Printing record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting printing record', error: error.message });
  }
};

export const getPrintingById = async (req, res) => {
  try {
    const { id } = req.params;
    const printing = await Printing.findById(id);
    if (!printing) return res.status(404).json({ message: 'Printing record not found' });
    res.status(200).json(printing);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching printing record', error: error.message });
  }
};

export const updatePrinting = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPrinting = await Printing.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedPrinting) return res.status(404).json({ message: 'Printing record not found' });
    res.status(200).json(updatedPrinting);
  } catch (error) {
    res.status(500).json({ message: 'Error updating printing record', error: error.message });
  }
};

import { drawReportHeader } from '../utils/reportPdfGenerator.js';

export const downloadPrintingReportPDF = async (req, res) => {
  try {
    let query = {};
    if (req.query.startDate && req.query.endDate && req.query.startDate !== 'undefined') {
      const start = new Date(req.query.startDate);
      start.setHours(0,0,0,0);
      const end = new Date(req.query.endDate);
      end.setHours(23,59,59,999);
      query.createdAt = { $gte: start, $lte: end };
    }

    const printings = await Printing.find(query).sort({ createdAt: -1 });
    const settings = await Settings.findOne() || {};

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=printing-report-${Date.now()}.pdf`);
    doc.pipe(res);

    const primaryGreen = '#2ea354';
    const primaryRed = '#e60000';

    let periodText = 'All Time';
    if (req.query.startDate && req.query.endDate) {
      periodText = `${req.query.startDate} to ${req.query.endDate}`;
    }

    drawReportHeader(doc, 'PRINTING REPORT', periodText, settings);

    const totalAmount = printings.reduce((sum, print) => sum + (print.amount || 0), 0);

    const table = {
      headers: ["Voucher No.", "Date", "Press Name", "Details", "Amount"],
      rows: [
        ...printings.map(print => [
          print.billNumber || '-',
          print.createdAt ? print.createdAt.toISOString().slice(0, 10) : '-',
          print.pressName || '-',
          print.details || '-',
          `Rs. ${print.amount || 0}`
        ]),
        ['', '', '', 'Total Printing Expense:', `Rs. ${totalAmount}`]
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
        if (indexRow === printings.length && indexColumn === 0) {
          summaryStartY = rectCell.y;
        }

        // Alternating row background
        if (indexColumn === 0) {
          if (indexRow % 2 === 0) doc.addBackground(rectRow, '#f0f9f0', 1);
        }
        
        // Draw inner vertical borders manually
        if (indexColumn < 4) {
          doc.moveTo(rectCell.x + rectCell.width, rectCell.y)
             .lineTo(rectCell.x + rectCell.width, rectCell.y + rectCell.height)
             .lineWidth(1).strokeColor(primaryGreen).stroke();
        }
        
        // Font styles
        if (indexRow === printings.length) doc.font("Helvetica-Bold").fontSize(9).fillColor('#000000');
        else doc.font("Helvetica").fontSize(9).fillColor('#333333');
      }
    });

    // Draw header vertical lines in white
    colXs.forEach((x, i) => {
      if (i < 4) {
        doc.moveTo(x, tableTop).lineTo(x, headerBottomY).lineWidth(1).strokeColor('#ffffff').stroke();
      }
    });

    if (summaryStartY > 0) {
      // Erase lines in the empty block (columns 0 to 2)
      doc.rect(26, summaryStartY + 1, colXs[2] - 26, doc.y - summaryStartY - 1).fill('#ffffff');
      // Redraw the separating vertical line just in case it got clipped
      doc.moveTo(colXs[2], summaryStartY).lineTo(colXs[2], doc.y).lineWidth(1).strokeColor(primaryGreen).stroke();
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

export const downloadPrintingBillPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const printing = await Printing.findById(id);
    if (!printing) return res.status(404).json({ message: 'Printing record not found' });

    const settings = await Settings.findOne() || {};

    const doc = new PDFDocument({ margin: 0, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Printing-Voucher-${printing.billNumber || id}.pdf`);
    doc.pipe(res);

    const data = {
      billNumber: printing.billNumber || '1',
      date: printing.createdAt ? printing.createdAt.toISOString().slice(0, 10).split('-').reverse().join('-') : new Date().toISOString().slice(0, 10).split('-').reverse().join('-'),
      customerId: 'PRT-102',
      partyType: 'PRESS / VENDOR',
      partyName: printing.pressName || 'Vendor',
      partyAddress: '',
      partyGst: '',
      subject: 'Printing Services',
      details: printing.details || 'Printing Services',
      amount: printing.amount || 0
    };

    generateProformaInvoice(doc, data, settings);

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating PDF bill', error: error.message });
  }
};
