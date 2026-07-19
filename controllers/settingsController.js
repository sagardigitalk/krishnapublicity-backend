import Settings from '../models/Settings.js';

const defaultSettings = {
  logo: '',
  brandName: 'KRISHNA PUBLICITY',
  tagline: 'PREMIUM OUTDOOR ADVERTISING',
  email: 'krishnapublicity2016@gmail.com',
  phone: '+91 7878161516',
  altPhone: '+91 78740 51516',
  address: 'C-107, First Floor, Ambikapark Apt, Opp. HDFC Bank, Nr. Laxmi Tiles, Punagam, Surat, Gujarat, India',
  mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1241.3165544824567!2d72.86615550177982!3d21.202212736660353!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f7d045e2bc1%3A0x6e0d37977ac07b2c!2sKRISHNA%20PUBLICITY!5e0!3m2!1sen!2sin!4v1730006460466!5m2!1sen!2sin',
  socialLinks: {
    instagram: 'https://instagram.com/krishnapublicity_surat',
    facebook: 'https://www.facebook.com/krishna.pubgps',
    twitter: 'https://twitter.com/Mrsanju_krishna'
  }
};

// Get Site Settings
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(defaultSettings);
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Site Settings
export const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }

    if (req.body.logo !== undefined) settings.logo = req.body.logo;
    if (req.body.brandName !== undefined) settings.brandName = req.body.brandName;
    if (req.body.tagline !== undefined) settings.tagline = req.body.tagline;
    if (req.body.email !== undefined) settings.email = req.body.email;
    if (req.body.phone !== undefined) settings.phone = req.body.phone;
    if (req.body.altPhone !== undefined) settings.altPhone = req.body.altPhone;
    if (req.body.address !== undefined) settings.address = req.body.address;
    if (req.body.mapUrl !== undefined) settings.mapUrl = req.body.mapUrl;
    if (req.body.socialLinks !== undefined) {
      settings.socialLinks = {
        instagram: req.body.socialLinks.instagram || '',
        facebook: req.body.socialLinks.facebook || '',
        twitter: req.body.socialLinks.twitter || ''
      };
    }

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
