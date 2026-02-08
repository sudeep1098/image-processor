import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { generatePresignedUrl, getDownloadUrl, listObjects } from '../services/s3.service.js';

const router = express.Router();

/**
 * POST /api/upload/presigned-url
 * Generate presigned URL for S3 upload
 */
router.post('/presigned-url', async (req, res) => {
  try {
    const { fileName, contentType = 'image/png' } = req.body;

    if (!fileName) {
      return res.status(400).json({ error: 'fileName is required' });
    }

    // Validate file size from header
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.headers['x-file-size'] && parseInt(req.headers['x-file-size']) > maxSize) {
      return res.status(413).json({ error: 'File size exceeds 5MB limit' });
    }

    // Generate unique key
    const fileExtension = fileName.split('.').pop();
    const uniqueKey = `uploads/${uuidv4()}.${fileExtension}`;

    // Generate presigned URL
    const presignedUrl = await generatePresignedUrl(
      process.env.S3_BUCKET_NAME,
      uniqueKey,
      contentType
    );

    res.json({
      presignedUrl,
      key: uniqueKey,
      bucket: process.env.S3_BUCKET_NAME,
      contentType, // Return the exact contentType used for signing
    });
  } catch (error) {
    console.error('❌ Presigned URL error:', error.message);
    res.status(500).json({ error: 'Failed to generate presigned URL', details: error.message });
  }
});

/**
 * POST /api/upload/complete
 * Confirm upload completion and save metadata
 */
router.post('/complete', async (req, res) => {
  try {
    const { key, fileName, originalName } = req.body;

    if (!key) {
      return res.status(400).json({ error: 'key is required' });
    }

    // Here you can save metadata to database
    const uploadRecord = {
      id: uuidv4(),
      key,
      fileName,
      originalName,
      uploadedAt: new Date(),
      status: 'completed',
    };

    res.json({
      success: true,
      message: 'Upload completed successfully',
      data: uploadRecord,
    });
  } catch (error) {
    console.error('Upload completion error:', error);
    res.status(500).json({ error: 'Failed to complete upload' });
  }
});

/**
 * GET /api/upload/images
 * Get download URLs for all uploaded images
 */
router.get('/images', async (req, res) => {
  try {
    const objects = await listObjects(process.env.S3_BUCKET_NAME, 'uploads/');

    const images = await Promise.all(
      objects.map(async (obj) => {
        const downloadUrl = await getDownloadUrl(process.env.S3_BUCKET_NAME, obj.Key);
        return {
          key: obj.Key,
          name: obj.Key.split('/').pop(),
          size: obj.Size,
          lastModified: obj.LastModified,
          url: downloadUrl,
        };
      })
    );

    res.json({ images });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

/**
 * GET /api/upload/image/:key
 * Get download URL for specific image
 */
router.get('/image/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const decodedKey = decodeURIComponent(key);

    const downloadUrl = await getDownloadUrl(process.env.S3_BUCKET_NAME, decodedKey);

    res.json({
      key: decodedKey,
      url: downloadUrl,
    });
  } catch (error) {
    console.error('Error getting image URL:', error);
    res.status(500).json({ error: 'Failed to get image URL' });
  }
});

export default router;
