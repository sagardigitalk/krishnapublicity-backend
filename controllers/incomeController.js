import Income from '../models/Income.js';

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
      { $group: { _id: null, totalGiven: { $sum: "$givenAmount" }, totalPending: { $sum: "$pendingAmount" } } }
    ]);
    
    const totalGiven = totals.length > 0 ? totals[0].totalGiven : 0;
    const totalPending = totals.length > 0 ? totals[0].totalPending : 0;
    
    res.status(200).json({
      data: incomes,
      totalRecords,
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
    const income = new Income(req.body);
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
