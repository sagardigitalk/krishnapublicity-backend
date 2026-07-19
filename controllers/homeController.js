import HomeContent from '../models/HomeContent.js';

const defaultFeature = {
  badge: 'Welcome to Krishna Publicity',
  title: 'Creativity That Elevates the Impact of Every Campaign',
  description: 'Our design team combines advanced market research, smart placements, and modern aesthetics to refine billboards, transit ads, and every critical branding component. We innovate with one goal in mind—delivering campaigns that perform better, last longer, and create real value for your brand.',
  buttonText: 'Discover More',
  buttonLink: '#services',
  image: '/serviceimage/graphicmain1.jpg'
};

export const getHomeContent = async (req, res) => {
  try {
    let content = await HomeContent.findOne();
    if (!content) {
      content = await HomeContent.create({
        hero: {
          title: 'Krishna Publicity',
          subtitle: 'Elevate your market presence with premium outdoor advertising and immersive digital campaigns crafted for impact.',
          image: ''
        },
        feature: defaultFeature,
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
    } else if (!content.feature || !content.feature.title) {
      content.feature = defaultFeature;
      await content.save();
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateHomeContent = async (req, res) => {
  try {
    let content = await HomeContent.findOne();
    if (!content) {
      content = new HomeContent({});
    }

    if (req.body.hero !== undefined) content.hero = req.body.hero;
    if (req.body.feature !== undefined) content.feature = req.body.feature;
    if (req.body.stats !== undefined) content.stats = req.body.stats;
    if (req.body.services !== undefined) content.services = req.body.services;

    const updatedContent = await content.save();
    res.json(updatedContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
