import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param {Buffer} fileBuffer - Image file buffer
 * @param {string} fileName - Original file name
 * @returns {Promise<string>} Cloudinary URL
 */
export const uploadImageToCloudinary = async (fileBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    // Remove file extension from fileName to avoid double extensions (e.g., .webp.webp)
    const fileNameWithoutExt = fileName.replace(/\.[^/.]+$/, '');

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'tools-rental',
        public_id: `${Date.now()}-${fileNameWithoutExt.replace(/\s+/g, '_')}`,
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Upload multiple images to Cloudinary
 * @param {Array} files - Array of file objects {buffer, originalname}
 * @returns {Promise<Array>} Array of Cloudinary URLs
 */
export const uploadMultipleImagesToCloudinary = async (files) => {
  if (!files || files.length === 0) {
    return [];
  }

  // Максимум 5 фотографий
  const filesToUpload = files.slice(0, 5);

  const uploadPromises = filesToUpload.map((file) =>
    uploadImageToCloudinary(file.buffer, file.originalname)
  );

  return Promise.all(uploadPromises);
};

/**
 * Delete image from Cloudinary
 * @param {string} url - Cloudinary URL
 * @returns {Promise}
 */
export const deleteImageFromCloudinary = async (url) => {
  try {
    // Extract public_id from URL
    const publicId = url.split('/').pop().split('.')[0];
    const folderPath = 'tools-rental';
    const fullPublicId = `${folderPath}/${publicId}`;

    await cloudinary.uploader.destroy(fullPublicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    // Don't throw, just log the error
  }
};
