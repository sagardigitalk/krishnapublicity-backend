import mongoose from 'mongoose';

const aboutContentSchema = new mongoose.Schema({
  title: { type: String, default: 'Where Creativity Meets Measurable Impact.' },
  description: { type: String, default: 'Krishna Publicity is not just an advertising agency...' },
  teamHeader: {
    subtitle: { type: String, default: 'Welcome to Krishna Publicity' },
    title: { type: String, default: "Gujarat's Most Reliable Advertising Family for Outdoor Campaigns" },
    description: { type: String, default: 'Our experienced Team members handle Strategy, Marketing, Design, and Execution — so you get premium service, every time.' }
  },
  aboutTeam: [
    {
      name: String,
      role: String,
      image: String,
      bio: String
    }
  ],
  team: [
    {
      name: String,
      role: String,
      image: String,
      bio: String
    }
  ],
  stats: [
    {
      label: String,
      value: String,
      icon: String
    }
  ]
}, {
  timestamps: true
});

const AboutContent = mongoose.model('AboutContent', aboutContentSchema);
export default AboutContent;
