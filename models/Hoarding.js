import mongoose from 'mongoose';

const singleHoardingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, default: '' },
  mainImage: { type: String, default: '' },
  galleryImages: [{ type: String }],
  description: { type: String, default: '' },
  specs: {
    size: { type: String, default: '' },
    lighting: { type: String, default: 'Illuminated' },
    availability: { type: String, default: 'Available' }
  }
});

const hoardingCitySchema = new mongoose.Schema({
  cityId: { type: String, required: true, unique: true },
  cityName: { type: String, required: true },
  cityImage: { type: String, default: '' },
  cityDescription: { type: String, default: '' },
  hoardings: [singleHoardingSchema]
}, {
  timestamps: true
});

const HoardingCity = mongoose.model('HoardingCity', hoardingCitySchema);
export default HoardingCity;
