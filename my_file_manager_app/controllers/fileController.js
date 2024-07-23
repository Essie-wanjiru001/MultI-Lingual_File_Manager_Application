const File = require('../models/file');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer storage and file filter
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads'); // Destination folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({ storage: storage });

exports.uploadFile = (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'File upload failed', error: err });
    }

    try {
      const { filename, size, mimetype } = req.file;
      const { userId } = req.body; // Assume user ID is sent in the body

      const file = await File.create({
        name: filename,
        size: size,
        type: mimetype,
        userId: userId,
        path: req.file.path,
      });

      res.status(201).json({ message: 'File uploaded successfully', file });
    } catch (error) {
      res.status(500).json({ message: 'Error saving file', error });
    }
  });
};

exports.getFile = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.json(file);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving file', error });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    fs.unlinkSync(file.path); // Delete the file from the server
    await file.destroy(); // Remove file record from database

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting file', error });
  }
};
