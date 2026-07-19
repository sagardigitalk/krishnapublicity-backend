import Partner from '../models/Partner.js';

// Get all partners
export const getPartners = async (req, res) => {
  try {
    const partners = await Partner.find();
    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update/replace entire partners list
export const updatePartners = async (req, res) => {
  try {
    const { partners } = req.body;
    if (!Array.isArray(partners)) {
      return res.status(400).json({ message: 'Partners array is required' });
    }

    // Delete existing partners and insert new list
    await Partner.deleteMany({});
    const cleanPartners = partners.map(p => ({
      name: p.name || '',
      image: p.image || ''
    }));
    const updatedPartners = await Partner.insertMany(cleanPartners);

    res.json(updatedPartners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
