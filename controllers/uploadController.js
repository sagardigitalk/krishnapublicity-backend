import { v2 as cloudinary } from 'cloudinary';

export const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).send('No image uploaded');
  }
  // req.file.path contains the secure URL provided by Cloudinary
  const imagePath = req.file.path;
  res.send(imagePath);
};

export const deleteImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ message: 'imageUrl is required' });
    }

    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder_name/public_id.jpg
    const parts = imageUrl.split('/');
    const fileNameWithExt = parts[parts.length - 1];
    const folderName = parts[parts.length - 2];
    const fileName = fileNameWithExt.split('.')[0];
    
    // In our middleware, we set the folder to 'krishna-publicity'
    const publicId = `${folderName}/${fileName}`;

    // Destroy image in Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      return res.status(200).json({ message: 'Image deleted successfully from Cloudinary' });
    } else {
      return res.status(200).json({ message: 'Image not found in Cloudinary, reference cleared' });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    return res.status(500).json({ message: 'Failed to delete image from Cloudinary', error: error.message });
  }
};
