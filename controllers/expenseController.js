import Expense from '../models/Expense.js';

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
      { $group: { _id: null, totalGiven: { $sum: "$givenAmount" }, totalPending: { $sum: "$pendingAmount" } } }
    ]);
    
    const totalGiven = totals.length > 0 ? totals[0].totalGiven : 0;
    const totalPending = totals.length > 0 ? totals[0].totalPending : 0;
    
    res.status(200).json({
      data: expenses,
      totalRecords,
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
    const expense = new Expense(req.body);
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
