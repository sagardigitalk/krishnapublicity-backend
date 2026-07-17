import mongoose from 'mongoose';

const aboutContentSchema = new mongoose.Schema({
  title: { type: String, default: 'Where Creativity Meets Measurable Impact.' },
  description: { type: String, default: 'Krishna Publicity is not just an advertising agency...' },
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
