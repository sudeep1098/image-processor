import AWS from "aws-sdk";

// Initialize S3 client
// - Uses environment variables for local development (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
// - Uses EC2 IAM role when deployed on EC2 (no env vars needed)
const s3Config = {
  region: process.env.AWS_REGION || "ap-south-1",
  signatureVersion: 'v4', // Required: Use AWS Signature Version 4 (AWS4-HMAC-SHA256)
};

// Only add credentials if they exist in environment (for local development)
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  s3Config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  s3Config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
}

const s3 = new AWS.S3(s3Config);

/**
 * Generate presigned URL for uploading to S3
 * @param {string} bucketName - S3 bucket name
 * @param {string} key - S3 object key
 * @param {string} contentType - MIME type
 * @returns {Promise<string>} Presigned URL
 */
export const generatePresignedUrl = async (
  bucketName,
  key,
  contentType = "image/png",
) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: 300, // 5 minutes
      ContentType: contentType,
    };

    const url = await s3.getSignedUrlPromise("putObject", params);
    return url;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw new Error("Failed to generate presigned URL");
  }
};

/**
 * Get presigned URL for downloading/viewing from S3
 * @param {string} bucketName - S3 bucket name
 * @param {string} key - S3 object key
 * @returns {Promise<string>} Presigned URL
 */
export const getDownloadUrl = async (bucketName, key) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: 3600, // 1 hour
    };

    const url = await s3.getSignedUrlPromise("getObject", params);
    return url;
  } catch (error) {
    console.error("Error generating download URL:", error);
    throw new Error("Failed to generate download URL");
  }
};

/**
 * Delete object from S3
 * @param {string} bucketName - S3 bucket name
 * @param {string} key - S3 object key
 * @returns {Promise<void>}
 */
export const deleteObject = async (bucketName, key) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: key,
    };

    await s3.deleteObject(params).promise();
  } catch (error) {
    console.error("Error deleting object:", error);
    throw new Error("Failed to delete object");
  }
};

/**
 * List objects in S3 bucket
 * @param {string} bucketName - S3 bucket name
 * @param {string} prefix - Optional prefix for filtering
 * @returns {Promise<Array>} List of objects
 */
export const listObjects = async (bucketName, prefix = "") => {
  try {
    const params = {
      Bucket: bucketName,
      Prefix: prefix,
    };

    const data = await s3.listObjectsV2(params).promise();
    return data.Contents || [];
  } catch (error) {
    console.error("Error listing objects:", error);
    throw new Error("Failed to list objects");
  }
};
