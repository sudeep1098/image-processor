// Use same-origin by default (proxied via nginx); override with VITE_API_URL for local dev
const API_URL = import.meta.env.VITE_API_URL ?? '';

interface PresignedUrlResponse {
  presignedUrl: string;
  key: string;
  bucket: string;
  contentType: string;
}

interface UploadResult {
  success: boolean;
  data?: PresignedUrlResponse;
  error?: string;
}

/**
 * Get presigned URL from backend
 */
export const getPresignedUrl = async (fileName: string, contentType: string = 'image/png'): Promise<PresignedUrlResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/upload/presigned-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName, contentType }),
    });

    if (!response.ok) {
      throw new Error('Failed to get presigned URL');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting presigned URL:', error);
    throw error;
  }
};

/**
 * Upload file to S3 using presigned URL
 */
export const uploadToS3 = async (file: File, presignedUrl: string, contentType: string, onProgress: (percent: number) => void): Promise<{ success: boolean }> => {
  try {
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          onProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({ success: true });
        } else {
          console.error(`❌ S3 Upload failed - Status: ${xhr.status}`);
          console.error('Response:', xhr.responseText);
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', (e) => {
        console.error('❌ Network error during upload:', e);
        reject(new Error('Network error during upload'));
      });

      xhr.addEventListener('abort', () => {
        console.error('❌ Upload was aborted');
        reject(new Error('Upload was aborted'));
      });

      xhr.open('PUT', presignedUrl);
      xhr.setRequestHeader('Content-Type', contentType);
      xhr.send(file);
    });
  } catch (error) {
    console.error('❌ Error uploading to S3:', error);
    throw error;
  }
};

/**
 * Complete upload by notifying backend
 */
export const completeUpload = async (key: string, fileName: string, originalName: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/api/upload/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key, fileName, originalName }),
    });

    if (!response.ok) {
      throw new Error('Failed to complete upload');
    }

    return await response.json();
  } catch (error) {
    console.error('Error completing upload:', error);
    throw error;
  }
};

/**
 * Main upload function - orchestrates the entire upload process
 */
export const uploadImageApi = async (file: File, onProgress: (percent: number) => void): Promise<UploadResult> => {
  try {
    // Step 1: Get presigned URL
    const fileContentType = file.type || 'image/png';
    const { presignedUrl, key, contentType } = await getPresignedUrl(
      file.name,
      fileContentType
    );

    // Step 2: Upload file to S3 - MUST use the exact contentType from the presigned URL response
    // This ensures Content-Type header matches what was used to sign the URL
    await uploadToS3(file, presignedUrl, contentType, onProgress);

    // Step 3: Notify backend of completion
    const result = await completeUpload(key, key.split('/').pop() || key, file.name);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Upload failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Fetch all uploaded images
 */
export const fetchUploadedImages = async () => {
  try {
    const response = await fetch(`${API_URL}/api/upload/images`);

    if (!response.ok) {
      throw new Error('Failed to fetch images');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};

/**
 * Get download URL for specific image
 */
export const getImageDownloadUrl = async (key: string) => {
  try {
    const response = await fetch(
      `${API_URL}/api/upload/image/${encodeURIComponent(key)}`
    );

    if (!response.ok) {
      throw new Error('Failed to get image URL');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting image URL:', error);
    throw error;
  }
};
