export const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).send('No image uploaded');
  }
  // The path the frontend will use to access the image
  res.send(`/${req.file.path.replace(/\\/g, '/')}`);
};
