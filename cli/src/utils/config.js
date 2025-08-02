/**
 * Configuration management for ShareIO CLI
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // Backend service configuration
  backend: {
    host: process.env.SHAREIO_HOST || 'localhost',
    port: process.env.SHAREIO_PORT || '8080',
    protocol: process.env.SHAREIO_PROTOCOL || 'http',
    timeout: parseInt(process.env.SHAREIO_TIMEOUT) || 30000, // 30 seconds
  },

  // File upload configuration
  upload: {
    chunkSize: parseInt(process.env.UPLOAD_CHUNK_SIZE) || 1024 * 1024, // 1MB chunks
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 100 * 1024 * 1024, // 100MB
    retries: parseInt(process.env.UPLOAD_RETRIES) || 3,
  },

  // Download configuration
  download: {
    timeout: parseInt(process.env.DOWNLOAD_TIMEOUT) || 60000, // 60 seconds
    retries: parseInt(process.env.DOWNLOAD_RETRIES) || 3,
  },

  // CLI configuration
  cli: {
    progressUpdateInterval: parseInt(process.env.PROGRESS_UPDATE_INTERVAL) || 100, // ms
    colorOutput: process.env.NO_COLOR !== 'true',
  }
};

/**
 * Get the base URL for the backend service
 * @param {string} host - Optional host override
 * @param {string} port - Optional port override
 * @returns {string} Base URL
 */
export function getBackendUrl() {
  const finalHost = config.backend.host;
  const finalPort = config.backend.port;
  return `${config.backend.protocol}://${finalHost}:${finalPort}`;
}

/**
 * Validate configuration
 * @returns {boolean} True if configuration is valid
 */
export function validateConfig() {
  const required = [
    config.backend.host,
    config.backend.port,
  ];

  return required.every(value => value !== undefined && value !== null && value !== '');
}
