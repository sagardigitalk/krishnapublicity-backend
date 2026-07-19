import mongoose from 'mongoose';

const brandingSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, default: '' },
  galleryImages: [{ type: String }],
  description: { type: String, default: '' }
}, {
  timestamps: true
});

const Branding = mongoose.model('Branding', brandingSchema);
export default Branding;
