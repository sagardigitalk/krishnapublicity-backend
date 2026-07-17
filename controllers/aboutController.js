import AboutContent from '../models/AboutContent.js';

export const getAboutContent = async (req, res) => {
  try {
    let content = await AboutContent.findOne();
    if (!content) {
      // Create default content if none exists
      content = await AboutContent.create({
        title: 'Where Creativity Meets Measurable Impact.',
        description: 'Krishna Publicity isn’t just an advertising agency. We are architects of brand experiences, meticulously designing campaigns that resonate and convert.',
        team: [
          { name: 'Mr. Sanjay Ahir', role: 'Founding Partner', image: '/founder1.jpg', bio: 'Visionary with over 15 years experience.' },
          { name: 'Vivek Ahir', role: 'Founding Partner', image: '/founder2.jpg', bio: 'Passionate about driving innovation.' }
        ]
      });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAboutContent = async (req, res) => {
  try {
    const content = await AboutContent.findOne();
    if (content) {
      content.title = req.body.title || content.title;
      content.description = req.body.description || content.description;
      content.team = req.body.team || content.team;
      
      const updatedContent = await content.save();
      res.json(updatedContent);
    } else {
      res.status(404).json({ message: 'Content not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
