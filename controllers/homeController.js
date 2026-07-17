import HomeContent from '../models/HomeContent.js';

export const getHomeContent = async (req, res) => {
  try {
    let content = await HomeContent.findOne();
    if (!content) {
      // Create default content if none exists
      content = await HomeContent.create({
        hero: {
          title: 'Krishna Publicity',
          subtitle: 'Elevate your market presence with premium outdoor advertising and immersive digital campaigns crafted for impact.',
        },
        stats: [
          { label: 'Years of Excellence', value: '10+', icon: 'users' },
          { label: 'Clients Served', value: '5000+', icon: 'check' },
          { label: 'Successful Campaigns', value: '3600+', icon: 'award' },
          { label: 'Client Satisfaction', value: '98%', icon: 'zap' }
        ],
        services: [
          { title: 'Outdoor Advertising', description: 'Billboards, Transit, and more.' }
        ]
      });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateHomeContent = async (req, res) => {
  try {
    const content = await HomeContent.findOne();
    if (content) {
      content.hero = req.body.hero || content.hero;
      content.stats = req.body.stats || content.stats;
      content.services = req.body.services || content.services;
      
      const updatedContent = await content.save();
      res.json(updatedContent);
    } else {
      res.status(404).json({ message: 'Content not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
