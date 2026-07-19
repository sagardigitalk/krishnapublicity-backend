import AboutContent from '../models/AboutContent.js';

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

// Get Team Header & Members
export const getTeamContent = async (req, res) => {
  try {
    let content = await AboutContent.findOne();
    if (!content) {
      content = await AboutContent.create({
        teamHeader: defaultTeamHeader,
        team: defaultTeam
      });
    } else {
      let modified = false;
      if (!content.teamHeader || !content.teamHeader.title) {
        content.teamHeader = defaultTeamHeader;
        modified = true;
      }
      if (!content.team || content.team.length === 0) {
        content.team = defaultTeam;
        modified = true;
      }
      if (modified) {
        await content.save();
      }
    }
    res.json({
      teamHeader: content.teamHeader,
      team: content.team
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Team Header & Members
export const updateTeamContent = async (req, res) => {
  try {
    let content = await AboutContent.findOne();
    if (!content) {
      content = new AboutContent({});
    }

    if (req.body.teamHeader !== undefined) {
      content.teamHeader = {
        subtitle: req.body.teamHeader.subtitle || '',
        title: req.body.teamHeader.title || '',
        description: req.body.teamHeader.description || ''
      };
    }

    if (req.body.team !== undefined && Array.isArray(req.body.team)) {
      content.team = req.body.team;
    }

    const updatedContent = await content.save();
    res.json({
      teamHeader: updatedContent.teamHeader,
      team: updatedContent.team
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
