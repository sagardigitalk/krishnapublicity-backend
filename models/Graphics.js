import mongoose from 'mongoose';

const graphicsSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, default: '' },
  galleryImages: [{ type: String }],
  description: { type: String, default: '' }
}, {
  timestamps: true
});

const Graphics = mongoose.model('Graphics', graphicsSchema);
export default Graphics;
