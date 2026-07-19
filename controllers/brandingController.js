import Branding from '../models/Branding.js';

const defaultBrandingItems = [
  {
    slug: 'tricycle-ad',
    name: 'Tricycle Ad',
    image: '/branndingImage/t1.jpg',
    galleryImages: ['/branndingImage/t2.jpg', '/branndingImage/t3.jpg', '/branndingImage/t4.jpg'],
    description: 'Mobile advertising on tricycles for maximum visibility'
  },
  {
    slug: 'rickshaw-ad',
    name: 'Rickshaw Ad',
    image: '/branndingImage/r1.jpg',
    galleryImages: ['/branndingImage/r2.jpg', '/branndingImage/r3.jpg', '/branndingImage/r4.jpg'],
    description: 'Eye-catching ads on rickshaws for local exposure'
  },
  {
    slug: 'wall-painting',
    name: 'Wall Painting',
    image: '/branndingImage/w1.jpg',
    galleryImages: ['/branndingImage/w2.jpg', '/branndingImage/w3.jpg', '/branndingImage/w4.jpg'],
    description: 'Large-scale artistic advertisements on building walls'
  },
  {
    slug: 'tempovan-ad',
    name: 'Tempovan Ad',
    image: '/branndingImage/te1.jpg',
    galleryImages: ['/branndingImage/te2.jpg', '/branndingImage/te4.jpg', '/branndingImage/te3.jpg'],
    description: 'Mobile advertising on tempo vans for wider reach'
  },
  {
    slug: 'canopy',
    name: 'Canopy',
    image: '/branndingImage/c1.jpg',
    galleryImages: ['/branndingImage/c4.jpg', '/branndingImage/c2.jpg', '/branndingImage/c3.jpg'],
    description: 'Branded canopies for events and outdoor promotions'
  },
  {
    slug: 'gazebo',
    name: 'Gazebo',
    image: '/branndingImage/g1.jpg',
    galleryImages: ['/branndingImage/g4.jpg', '/branndingImage/g2.jpg', '/branndingImage/g3.jpg'],
    description: 'Customized gazebos for trade shows and exhibitions'
  },
  {
    slug: 'acrylic-boards',
    name: 'Acrylic Boards',
    image: '/branndingImage/li1.jpg',
    galleryImages: ['/branndingImage/li4.jpg', '/branndingImage/li2.jpg', '/branndingImage/li3.jpg'],
    description: 'Sleek and modern acrylic signage for businesses'
  },
  {
    slug: 'acp-elevation',
    name: 'ACP Elevation',
    image: '/branndingImage/ac1.jpg',
    galleryImages: ['/branndingImage/ac4.jpg', '/branndingImage/ac2.jpg', '/branndingImage/ac3.jpg'],
    description: 'Aluminum Composite Panel elevations for building branding'
  },
  {
    slug: 'non-woven-bag',
    name: 'Non Woven Bag',
    image: '/branndingImage/no2.jpg',
    galleryImages: ['/branndingImage/no4.jpg', '/branndingImage/no2.jpg', '/branndingImage/no3.jpg'],
    description: 'Eco-friendly and durable promotional bags'
  },
  {
    slug: 'lighting-board',
    name: 'Lighting Board',
    image: '/branndingImage/a1.jpg',
    galleryImages: ['/branndingImage/a4.jpg', '/branndingImage/a2.jpg', '/branndingImage/a3.jpg'],
    description: 'Illuminated signage for enhanced visibility'
  },
  {
    slug: 'led-board',
    name: 'LED Board',
    image: '/branndingImage/le1.jpg',
    galleryImages: ['/branndingImage/le4.jpg', '/branndingImage/le2.jpg', '/branndingImage/le3.jpg'],
    description: 'Energy-efficient LED displays for dynamic advertising'
  },
  {
    slug: 'sunpack-board',
    name: 'Sunpack Board',
    image: '/branndingImage/sp1.jpg',
    galleryImages: ['/branndingImage/sp4.jpg', '/branndingImage/sp2.jpg', '/branndingImage/sp3.jpg'],
    description: 'Durable and weather-resistant signage for outdoor use'
  }
];

// Get all branding items
export const getBranding = async (req, res) => {
  try {
    let items = await Branding.find();
    if (items.length === 0) {
      items = await Branding.insertMany(defaultBrandingItems);
    }
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new branding item
export const createBranding = async (req, res) => {
  try {
    const { name, image, galleryImages, description } = req.body;
    const slug = req.body.slug || name.toLowerCase().replace(/[^a-z0-0]/g, '-');
    const existing = await Branding.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: 'Branding item slug already exists' });
    }
    const newItem = await Branding.create({
      slug,
      name,
      image: image || '',
      galleryImages: galleryImages || [],
      description: description || ''
    });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update branding item
export const updateBranding = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Branding.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete branding item
export const deleteBranding = async (req, res) => {
  try {
    const { id } = req.params;
    await Branding.findByIdAndDelete(id);
    res.json({ message: 'Branding item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
