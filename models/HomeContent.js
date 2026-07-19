import mongoose from 'mongoose';

const homeContentSchema = new mongoose.Schema({
  hero: {
    title: { type: String, default: 'Elevate Your Market Presence' },
    subtitle: { type: String, default: 'Premium outdoor advertising and immersive digital campaigns.' },
    image: { type: String, default: '' },
  },
  feature: {
    badge: { type: String, default: 'Welcome to Krishna Publicity' },
    title: { type: String, default: 'Creativity That Elevates the Impact of Every Campaign' },
    description: { type: String, default: 'Our design team combines advanced market research, smart placements, and modern aesthetics to refine billboards, transit ads, and every critical branding component.' },
    buttonText: { type: String, default: 'Discover More' },
    buttonLink: { type: String, default: '#services' },
    image: { type: String, default: '/serviceimage/graphicmain1.jpg' },
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
