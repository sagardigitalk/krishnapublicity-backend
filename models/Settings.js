import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  logo: { type: String, default: '' },
  brandName: { type: String, default: 'KRISHNA PUBLICITY' },
  tagline: { type: String, default: 'PREMIUM OUTDOOR ADVERTISING' },
  email: { type: String, default: 'krishnapublicity2016@gmail.com' },
  phone: { type: String, default: '+91 7878161516' },
  altPhone: { type: String, default: '+91 78740 51516' },
  address: { 
    type: String, 
    default: 'C-107, First Floor, Ambikapark Apt, Opp. HDFC Bank, Nr. Laxmi Tiles, Punagam, Surat, Gujarat, India' 
  },
  mapUrl: { 
    type: String, 
    default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1241.3165544824567!2d72.86615550177982!3d21.202212736660353!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f7d045e2bc1%3A0x6e0d37977ac07b2c!2sKRISHNA%20PUBLICITY!5e0!3m2!1sen!2sin!4v1730006460466!5m2!1sen!2sin' 
  },
  socialLinks: {
    instagram: { type: String, default: 'https://instagram.com/krishnapublicity_surat' },
    facebook: { type: String, default: 'https://www.facebook.com/krishna.pubgps' },
    twitter: { type: String, default: 'https://twitter.com/Mrsanju_krishna' }
  }
}, {
  timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
