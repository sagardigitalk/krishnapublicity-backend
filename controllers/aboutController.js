import AboutContent from '../models/AboutContent.js';

const defaultStats = [
  { label: 'Years of Excellence', value: '10+', icon: 'users' },
  { label: 'Clients Served', value: '5000+', icon: 'check' },
  { label: 'Successful Campaigns', value: '3600+', icon: 'award' },
  { label: 'Client Satisfaction', value: '98%', icon: 'zap' }
];

const defaultTeamHeader = {
  subtitle: 'Welcome to Krishna Publicity',
  title: "Gujarat's Most Reliable Advertising Family for Outdoor Campaigns",
  description: 'Our experienced Team members handle Strategy, Marketing, Design, and Execution — so you get premium service, every time.'
};

const defaultTeam = [
  {
    name: 'Mr. Sanjay Ahir',
    role: 'Founding Partner',
    image: '/main1.jpg',
    bio: 'Visionary founding partner with over 15 years of advertising industry expertise.'
  },
  {
    name: 'Vivek Ahir',
    role: 'Founding Partner',
    image: '/main2.jpg',
    bio: 'Founding partner driving brand strategies and large-scale outdoor campaigns.'
  },
  {
    name: 'Mr. Umesh Zinzala',
    role: 'Managing Director',
    image: '/main3.jpg',
    bio: 'Bringing a wealth of creative expertise, Umesh has led numerous award-winning campaigns.'
  }
];

export const getAboutContent = async (req, res) => {
  try {
    let content = await AboutContent.findOne();
    if (!content) {
      content = await AboutContent.create({
        title: 'Where Creativity Meets Measurable Impact.',
        description: 'Krishna Publicity isn’t just an advertising agency. We are architects of brand experiences, meticulously designing campaigns that resonate and convert.',
        teamHeader: defaultTeamHeader,
        team: defaultTeam,
        aboutTeam: defaultTeam,
        stats: defaultStats
      });
    } else {
      let modified = false;
      if (!content.teamHeader || !content.teamHeader.title) {
        content.teamHeader = defaultTeamHeader;
        modified = true;
      }

      if (content.aboutTeam && content.aboutTeam.length > 0) {
        content.aboutTeam = content.aboutTeam.map((member, index) => {
          if (!member.image || member.image.includes('founder')) {
            modified = true;
            const fallbackImages = ['/main1.jpg', '/main2.jpg', '/main3.jpg'];
            return {
              ...member.toObject(),
              image: fallbackImages[index % fallbackImages.length]
            };
          }
          return member;
        });
      } else {
        if (content.team && content.team.length > 0) {
          content.aboutTeam = content.team;
        } else {
          content.aboutTeam = defaultTeam;
        }
        modified = true;
      }

      if (!content.stats || content.stats.length === 0) {
        content.stats = defaultStats;
        modified = true;
      }

      if (modified) {
        await content.save();
      }
    }

    const responseData = content.toObject ? content.toObject() : content;
    responseData.team = responseData.aboutTeam;
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAboutContent = async (req, res) => {
  try {
    let content = await AboutContent.findOne();
    if (!content) {
      content = new AboutContent({});
    }

    if (req.body.title !== undefined) content.title = req.body.title;
    if (req.body.description !== undefined) content.description = req.body.description;
    if (req.body.teamHeader !== undefined) content.teamHeader = req.body.teamHeader;
    if (req.body.team !== undefined) content.aboutTeam = req.body.team;
    if (req.body.stats !== undefined) content.stats = req.body.stats;

    const updatedContent = await content.save();
    
    const responseData = updatedContent.toObject ? updatedContent.toObject() : updatedContent;
    responseData.team = responseData.aboutTeam;
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
