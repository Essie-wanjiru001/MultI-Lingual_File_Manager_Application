const File = require('../models/file');
const path = require('path');
const fs = require('fs');

// Upload a file
exports.uploadFile = async (req, res) => {
  try {
    const { originalname, size, mimetype } = req.file;
    const file = await File.create({
      name: originalname,
      size,
      type: mimetype,
      userId: req.user.id, // Assuming you have user info from authentication middleware
      path: req.file.path,
    });
    res.redirect('/api/files/filemanager'); // Redirect to file manager page after upload
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllFilesForView = async () => {
  try {
    const files = await File.findAll();
    return files;
  } catch (error) {
    throw new Error(error.message);
  }
};


// Get a file by ID
exports.getFileById = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (file) {
      res.status(200).json(file);
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a file by ID
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (file) {
      fs.unlinkSync(file.path); // Delete file from the filesystem
      await file.destroy(); // Delete file record from the database
      res.redirect('/api/files/filemanager'); // Redirect to file manager page after deletion
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
