import HoardingCity from '../models/Hoarding.js';

const defaultHoardingCities = [
  {
    cityId: 'bhavnagar',
    cityName: 'Bhavnagar',
    cityImage: '/hordingimage/bhavnagar1.jpg',
    cityDescription: 'Explore hoardings in the historic city of Bhavnagar',
    hoardings: [
      {
        name: 'Bhavnagar Central',
        location: 'Kalanala Chowk, Bhavnagar',
        mainImage: '/hordingimage/bhavnagar1.jpg',
        galleryImages: ['/hordingimage/bhavnagar1.jpg'],
        description: 'Prime hoarding location in central Bhavnagar with high traffic volume.',
        specs: { size: '40x20 ft', lighting: 'Illuminated', availability: 'Available' }
      },
      {
        name: 'Bhavnagar Highway',
        location: 'Vartej Highway, Bhavnagar',
        mainImage: '/hordingimage/b1.jpg',
        galleryImages: ['/hordingimage/b1.jpg'],
        description: 'High impact outdoor billboard on main Bhavnagar highway.',
        specs: { size: '60x30 ft', lighting: 'Illuminated', availability: 'Available' }
      }
    ]
  },
  {
    cityId: 'surat',
    cityName: 'Surat',
    cityImage: '/hordingimage/s1.jpg',
    cityDescription: 'Discover advertising opportunities in the Diamond City',
    hoardings: [
      {
        name: 'Surat Ring Road Prime',
        location: 'Ring Road, Surat',
        mainImage: '/hordingimage/s1.jpg',
        galleryImages: ['/hordingimage/s1.jpg'],
        description: 'Strategic hoarding site at busy Ring Road junction.',
        specs: { size: '50x25 ft', lighting: 'Illuminated', availability: 'Available' }
      }
    ]
  },
  {
    cityId: 'ahmedabad',
    cityName: 'Ahmedabad',
    cityImage: '/hordingimage/a1.jpg',
    cityDescription: 'Find prime hoarding locations in the largest city of Gujarat',
    hoardings: [
      {
        name: 'SG Highway Billboard',
        location: 'SG Highway, Ahmedabad',
        mainImage: '/hordingimage/a1.jpg',
        galleryImages: ['/hordingimage/a1.jpg'],
        description: 'Premium billboard location on SG Highway.',
        specs: { size: '60x30 ft', lighting: 'Illuminated', availability: 'Available' }
      }
    ]
  }
];

// Get all hoarding cities & hoardings
export const getHoardings = async (req, res) => {
  try {
    let cities = await HoardingCity.find();
    if (cities.length === 0) {
      cities = await HoardingCity.insertMany(defaultHoardingCities);
    }
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new City
export const createCity = async (req, res) => {
  try {
    const { cityId, cityName, cityImage, cityDescription } = req.body;
    const existing = await HoardingCity.findOne({ cityId: cityId.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'City ID already exists' });
    }
    const newCity = await HoardingCity.create({
      cityId: cityId.toLowerCase().replace(/\s+/g, '-'),
      cityName,
      cityImage: cityImage || '',
      cityDescription: cityDescription || '',
      hoardings: []
    });
    res.status(201).json(newCity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update City or its hoardings
export const updateCity = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await HoardingCity.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete City
export const deleteCity = async (req, res) => {
  try {
    const { id } = req.params;
    await HoardingCity.findByIdAndDelete(id);
    res.json({ message: 'City deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
