import Printing from '../models/Printing.js';

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
    const printing = new Printing(req.body);
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
