import fs from 'fs';
import path from 'path';

export const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).send('No image uploaded');
  }
  // The path the frontend will use to access the image
  const imagePath = `/${req.file.path.replace(/\\/g, '/')}`;
  res.send(imagePath);
};

export const deleteImage = (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ message: 'imageUrl is required' });
    }

    // Extract pathname from full URL or use relative path
    let relativePath = imageUrl;
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      try {
        const urlObj = new URL(imageUrl);
        relativePath = urlObj.pathname;
      } catch (err) {
        relativePath = imageUrl;
      }
    }

    // Clean leading slash
    if (relativePath.startsWith('/')) {
      relativePath = relativePath.substring(1);
    }

    // Normalize path and prevent directory traversal
    const normalizedPath = path.normalize(relativePath);
    if (!normalizedPath.startsWith('uploads') && !normalizedPath.startsWith('uploads\\')) {
      return res.status(200).json({ message: 'Static image reference cleared. File kept on disk.' });
    }

    const fullPath = path.join(process.cwd(), normalizedPath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return res.status(200).json({ message: 'Image deleted successfully from server' });
    } else {
      return res.status(200).json({ message: 'Image path not found on server, cleared reference' });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    return res.status(500).json({ message: 'Failed to delete image from server', error: error.message });
  }
};
