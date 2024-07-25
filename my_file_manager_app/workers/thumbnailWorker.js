const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const File = require('../models/file');

async function generateThumbnail(filePath, thumbnailPath) {
  await sharp(filePath)
    .resize(200, 200, { fit: 'inside' })
    .toFile(thumbnailPath);
}

module.exports = async function(job) {
  const { fileId } = job.data;
  
  try {
    const file = await File.findByPk(fileId);
    if (!file) {
      throw new Error('File not found');
    }

    const thumbnailDir = path.join(__dirname, '../public/thumbnails');
    await fs.mkdir(thumbnailDir, { recursive: true });

    const thumbnailPath = path.join(thumbnailDir, `${file.id}_thumb${path.extname(file.name)}`);
    await generateThumbnail(file.path, thumbnailPath);

    // Update file record with thumbnail path
    await file.update({ thumbnailPath: `/thumbnails/${path.basename(thumbnailPath)}` });

    console.log(`Thumbnail generated for file ${file.id}`);
  } catch (error) {
    console.error(`Error generating thumbnail for file ${fileId}:`, error);
    throw error;
  }
};