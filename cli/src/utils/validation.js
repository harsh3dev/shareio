/**
 * Input validation utilities for ShareIO CLI
 */

import fs from 'fs-extra';
import path from 'path';
import validator from 'validator';
import chalk from 'chalk';

/**
 * Validate if a file exists and is accessible
 * @param {string} filePath - Path to the file
 * @returns {object} Validation result
 */
export async function validateFile(filePath) {
  try {
    const resolvedPath = path.resolve(filePath);
    const stats = await fs.stat(resolvedPath);

    if (!stats.isFile()) {
      return {
        isValid: false,
        error: `${filePath} is not a file`
      };
    }

    // Check file size (100MB limit by default)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (stats.size > maxSize) {
      return {
        isValid: false,
        error: `File size (${formatFileSize(stats.size)}) exceeds maximum allowed size (${formatFileSize(maxSize)})`
      };
    }

    return {
      isValid: true,
      path: resolvedPath,
      size: stats.size,
      name: path.basename(resolvedPath)
    };
  } catch (error) {
    return {
      isValid: false,
      error: `Cannot access file: ${error.message}`
    };
  }
}

/**
 * Validate file code (port number)
 * @param {string} code - File code to validate
 * @returns {object} Validation result
 */
export function validateFileCode(code) {
  // Check if it's a valid port number
  const port = parseInt(code, 10);
  
  if (isNaN(port)) {
    return {
      isValid: false,
      error: 'File code must be a valid number'
    };
  }

  if (port < 1024 || port > 65535) {
    return {
      isValid: false,
      error: 'File code must be between 1024 and 65535'
    };
  }

  return {
    isValid: true,
    port: port
  };
}

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {object} Validation result
 */
export function validatePassword(password) {
  if (!password) {
    return {
      isValid: true, // Password is optional
      password: null
    };
  }

  if (password.length < 4) {
    return {
      isValid: false,
      error: 'Password must be at least 4 characters long'
    };
  }

  if (password.length > 50) {
    return {
      isValid: false,
      error: 'Password must be less than 50 characters long'
    };
  }

  return {
    isValid: true,
    password: password
  };
}

/**
 * Validate output directory
 * @param {string} outputPath - Path to validate
 * @returns {object} Validation result
 */
export async function validateOutputDirectory(outputPath) {
  try {
    const resolvedPath = path.resolve(outputPath);
    
    // Check if directory exists
    const exists = await fs.pathExists(resolvedPath);
    
    if (!exists) {
      // Try to create the directory
      await fs.ensureDir(resolvedPath);
    }

    // Check if it's accessible and writable
    await fs.access(resolvedPath, fs.constants.W_OK);

    return {
      isValid: true,
      path: resolvedPath
    };
  } catch (error) {
    return {
      isValid: false,
      error: `Output directory is not accessible: ${error.message}`
    };
  }
}

/**
 * Validate hostname
 * @param {string} host - Hostname to validate
 * @returns {object} Validation result
 */
export function validateHost(host) {
  if (!host) {
    return {
      isValid: false,
      error: 'Host cannot be empty'
    };
  }

  // Check if it's a valid IP or hostname
  const isValidIP = validator.isIP(host);
  const isValidFQDN = validator.isFQDN(host, { require_tld: false });
  const isLocalhost = host === 'localhost';

  if (!isValidIP && !isValidFQDN && !isLocalhost) {
    return {
      isValid: false,
      error: 'Invalid hostname or IP address'
    };
  }

  return {
    isValid: true,
    host: host
  };
}

/**
 * Format file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size
 */
export function formatFileSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Display validation error and exit
 * @param {string} error - Error message to display
 */
export function handleValidationError(error) {
  console.error(chalk.red('❌ Validation Error:'), error);
  process.exit(1);
}
