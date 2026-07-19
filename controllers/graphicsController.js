import Graphics from '../models/Graphics.js';

const defaultGraphicsItems = [
  {
    slug: 'board-banner',
    name: 'Board Banner',
    image: '/graphicsimage/bordbanner.jpg',
    galleryImages: ['/graphicsimage/bordbanner.jpg'],
    description: 'Large format printed banners for outdoor display'
  },
  {
    slug: 'business-card',
    name: 'Business Card',
    image: '/graphicsimage/bussineshcard.jpg',
    galleryImages: ['/graphicsimage/bussineshcard.jpg'],
    description: 'Professional business cards for networking'
  },
  {
    slug: 'bill-books',
    name: 'Bill Books',
    image: '/graphicsimage/billbook.jpg',
    galleryImages: ['/graphicsimage/billbook.jpg'],
    description: 'Custom bill books for businesses'
  },
  {
    slug: 'pamphlet',
    name: 'Pamphlet',
    image: '/graphicsimage/paplate.jpg',
    galleryImages: ['/graphicsimage/paplate.jpg'],
    description: 'Informative pamphlets for marketing'
  },
  {
    slug: 'brochure',
    name: 'Brochure',
    image: '/graphicsimage/brochure.jpg',
    galleryImages: ['/graphicsimage/brochure.jpg'],
    description: 'Detailed brochures for product showcases'
  },
  {
    slug: 'invitation-card',
    name: 'Invitation Card',
    image: '/graphicsimage/inviation.jpg',
    galleryImages: ['/graphicsimage/inviation.jpg'],
    description: 'Elegant invitation cards for events'
  },
  {
    slug: 'wedding-card',
    name: 'Wedding Card',
    image: '/graphicsimage/weddingcard.jpg',
    galleryImages: ['/graphicsimage/weddingcard.jpg'],
    description: 'Customized wedding cards and invitations'
  },
  {
    slug: 'digital-pdf',
    name: 'Digital PDF',
    image: '/graphicsimage/digital.jpg',
    galleryImages: ['/graphicsimage/digital.jpg'],
    description: 'Interactive digital PDFs for online distribution'
  },
  {
    slug: 'calendar',
    name: 'Calendar',
    image: '/graphicsimage/calender.jpg',
    galleryImages: ['/graphicsimage/calender.jpg'],
    description: 'Custom calendars for promotional purposes'
  },
  {
    slug: 'doctor-file',
    name: 'Doctor File',
    image: '/graphicsimage/doctorfile.jpg',
    galleryImages: ['/graphicsimage/doctorfile.jpg'],
    description: 'Specialized file folders for medical professionals'
  },
  {
    slug: 'letterhead',
    name: 'Letterhead',
    image: '/graphicsimage/letter.jpg',
    galleryImages: ['/graphicsimage/letter.jpg'],
    description: 'Professional letterheads for business correspondence'
  },
  {
    slug: 'traveling-books',
    name: 'Traveling Books',
    image: '/graphicsimage/travillang.jpg',
    galleryImages: ['/graphicsimage/travillang.jpg'],
    description: 'Compact, informative travel guides'
  },
  {
    slug: 'vinyl-sticker',
    name: 'Sticker Vinyl',
    image: '/graphicsimage/vinyl.jpg',
    galleryImages: ['/graphicsimage/vinyl.jpg'],
    description: 'Durable vinyl stickers for various applications'
  },
  {
    slug: 'blurred-film',
    name: 'Blurred Film',
    image: '/graphicsimage/blur.jpg',
    galleryImages: ['/graphicsimage/blur.jpg'],
    description: 'Decorative blurred film for windows and glass surfaces'
  },
  {
    slug: 'one-way-vision',
    name: 'One-Way Vision',
    image: '/graphicsimage/oneway.jpg',
    galleryImages: ['/graphicsimage/oneway.jpg'],
    description: 'One-way vision graphics for windows and vehicles'
  }
];

// Get all graphics items
export const getGraphics = async (req, res) => {
  try {
    let items = await Graphics.find();
    if (items.length === 0) {
      items = await Graphics.insertMany(defaultGraphicsItems);
    }
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new graphics item
export const createGraphics = async (req, res) => {
  try {
    const { name, image, galleryImages, description } = req.body;
    const slug = req.body.slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const existing = await Graphics.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: 'Graphics item slug already exists' });
    }
    const newItem = await Graphics.create({
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

// Update graphics item
export const updateGraphics = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Graphics.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete graphics item
export const deleteGraphics = async (req, res) => {
  try {
    const { id } = req.params;
    await Graphics.findByIdAndDelete(id);
    res.json({ message: 'Graphics item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
