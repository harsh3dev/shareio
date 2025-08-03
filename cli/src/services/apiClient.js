/**
 * API client for communicating with ShareIO backend service
 */

import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs-extra';
import path from 'path';
import { config, getBackendUrl } from '../utils/config.js';
import { showError } from '../utils/progress.js';


/**
 * Create an axios instance with default configuration
 * @returns {object} Axios instance
 */
function createApiClient() {
  const baseURL = getBackendUrl();
  
  return axios.create({
    baseURL,
    timeout: config.backend.timeout,
    headers: {
      'User-Agent': 'LiteShare-CLI/1.0.2'
    }
  });
}

/**
 * Upload a file to the backend service
 * @param {string} filePath - Path to the file to upload
 * @param {string} password - Optional password for the file
 * @returns {Promise<object>} Upload result
 */
export async function uploadFile(filePath, password) {
  try {
    const apiClient = createApiClient();
    const formData = new FormData();
    
    // Add file to form data
    const fileStream = fs.createReadStream(filePath);
    
    formData.append('file', fileStream);
    
    // Add password if provided
    if (password) {
      formData.append('password', password);
    }

    // Get form data length asynchronously
    const formLength = await new Promise((resolve, reject) => {
      formData.getLength((err, length) => {
        if (err) reject(err);
        else resolve(length);
      });
    });
    
    const response = await apiClient.post('/upload', formData, {
      headers: {
        ...formData.getHeaders(),
        'Content-Length': formLength
      },
      maxContentLength: config.upload.maxFileSize,
      maxBodyLength: config.upload.maxFileSize,
    });

    return {
      success: true,
      data: response.data,
      fileCode: response.data.port || response.data.fileCode,
      message: 'File uploaded successfully'
    };

  } catch (error) {
    return handleApiError('Failed to upload file', error);
  }
}

/**
 * Download a file from the backend service
 * @param {string} fileCode - File code (port number)
 * @param {string} password - Optional password for the file
 * @param {string} outputPath - Output directory path
 * @returns {Promise<object>} Download result
 */
export async function downloadFile(fileCode, password, outputPath) {
  try {
    const apiClient = createApiClient();
    
    // Build URL with password query parameter if provided
    let downloadUrl = `/download/${fileCode}`;
    if (password) {
      const encodedPassword = encodeURIComponent(password);
      downloadUrl += `?pass=${encodedPassword}`;
    }
    
    const response = await apiClient.get(downloadUrl, {
      responseType: 'stream',
      timeout: config.download.timeout
    });

    // Extract filename from Content-Disposition header (case-insensitive)
    let fileName = 'downloaded_file';
    const headers = response.headers;
    
    // Look for content-disposition header regardless of case
    for (const key in headers) {
      if (key.toLowerCase() === 'content-disposition') {
        const contentDisposition = headers[key];
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch.length === 2) {
          fileName = filenameMatch[1];
        }
        break;
      }
    }

    // Ensure output directory exists
    await fs.ensureDir(outputPath);
    
    // Generate unique filename if file already exists
    let finalPath = path.join(outputPath, fileName);
    const originalPath = finalPath;
    
    if (await fs.pathExists(finalPath)) {
      const ext = path.extname(fileName);
      const nameWithoutExt = path.basename(fileName, ext);
      let counter = 1;
      
      do {
        finalPath = path.join(outputPath, `${nameWithoutExt} (${counter})${ext}`);
        counter++;
      } while (await fs.pathExists(finalPath));
    }

    // Write file to disk
    const writer = fs.createWriteStream(finalPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        resolve({
          success: true,
          filePath: finalPath,
          fileName: path.basename(finalPath),
          originalFileName: fileName,
          message: 'File downloaded successfully'
        });
      });

      writer.on('error', (error) => {
        reject({
          success: false,
          error: `Failed to write file: ${error.message}`
        });
      });

      response.data.on('error', (error) => {
        reject({
          success: false,
          error: `Download failed: ${error.message}`
        });
      });
    });

  } catch (error) {
    return handleApiError('Failed to download file', error);
  }
}

/**
 * Check if the backend service is available
 * @returns {Promise<object>} Health check result
 */
export async function checkServiceHealth() {
  try {
    const apiClient = createApiClient();
    const response = await apiClient.get('/health', { timeout: 5000 });
    
    return {
      success: true,
      status: response.status,
      message: 'Service is available'
    };
  } catch (error) {
    return {
      success: false,
      error: `Service unavailable: ${error.message}`,
      suggestion: 'Make sure the ShareIO backend service is running'
    };
  }
}

/**
 * Handle API errors consistently
 * @param {string} defaultMessage - Default error message
 * @param {Error} error - The error object
 * @returns {object} Formatted error response
 */
function handleApiError(defaultMessage, error) {
  let errorMessage = defaultMessage;
  let suggestion = '';

  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const data = error.response.data;
    
    switch (status) {
      case 400:
        errorMessage = data?.message || 'Bad request - check your parameters';
        break;
      case 401:
        errorMessage = 'Unauthorized - check your password';
        break;
      case 404:
        errorMessage = 'File not found - check your file code';
        suggestion = 'Make sure the file code is correct and the file is still available';
        break;
      case 413:
        errorMessage = 'File too large';
        suggestion = 'Try uploading a smaller file';
        break;
      case 500:
        errorMessage = 'Server error';
        suggestion = 'Try again later or contact support';
        break;
      default:
        errorMessage = data?.message || `HTTP ${status}: ${defaultMessage}`;
    }
  } else if (error.request) {
    // Network error
    errorMessage = 'Network error - cannot reach the server';
    suggestion = 'Check your internet connection and make sure the backend service is running';
  } else {
    // Other error
    errorMessage = error.message || defaultMessage;
  }

  return {
    success: false,
    error: errorMessage,
    suggestion,
    statusCode: error.response?.status
  };
}
