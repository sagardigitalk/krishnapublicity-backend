import mongoose from 'mongoose';

const homeContentSchema = new mongoose.Schema({
  hero: {
    title: { type: String, default: 'Elevate Your Market Presence' },
    subtitle: { type: String, default: 'Premium outdoor advertising and immersive digital campaigns.' },
  },
  stats: [
    {
      label: String,
      value: String,
      icon: String
    }
  ],
  services: [
    {
      title: String,
      description: String,
    }
  ]
}, {
  timestamps: true
});

const HomeContent = mongoose.model('HomeContent', homeContentSchema);
export default HomeContent;
