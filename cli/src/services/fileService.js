/**
 * File service for handling file operations in ShareIO CLI
 */

import fs from 'fs-extra';
import path from 'path';
import { formatFileSize } from '../utils/validation.js';
import { showInfo, showSuccess, showError } from '../utils/progress.js';
import chalk from 'chalk';

/**
 * Get file information
 * @param {string} filePath - Path to the file
 * @returns {Promise<object>} File information
 */
export async function getFileInfo(filePath) {
  try {
    const stats = await fs.stat(filePath);
    const resolvedPath = path.resolve(filePath);
    
    return {
      success: true,
      info: {
        name: path.basename(resolvedPath),
        path: resolvedPath,
        size: stats.size,
        formattedSize: formatFileSize(stats.size),
        extension: path.extname(resolvedPath),
        modified: stats.mtime,
        isReadable: true
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Cannot access file: ${error.message}`
    };
  }
}

/**
 * Check if file exists and is accessible
 * @param {string} filePath - Path to the file
 * @returns {Promise<boolean>} True if file exists and is accessible
 */
export async function checkFileExists(filePath) {
  try {
    await fs.access(filePath, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Ensure directory exists and create if necessary
 * @param {string} dirPath - Directory path
 * @returns {Promise<object>} Result of directory creation
 */
export async function ensureDirectory(dirPath) {
  try {
    await fs.ensureDir(dirPath);
    return {
      success: true,
      path: path.resolve(dirPath)
    };
  } catch (error) {
    return {
      success: false,
      error: `Cannot create directory: ${error.message}`
    };
  }
}

/**
 * Generate a unique filename if file already exists
 * @param {string} filePath - Original file path
 * @returns {string} Unique file path
 */
export async function generateUniqueFilename(filePath) {
  if (!(await fs.pathExists(filePath))) {
    return filePath;
  }

  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const nameWithoutExt = path.basename(filePath, ext);
  
  let counter = 1;
  let newFilePath;
  
  do {
    newFilePath = path.join(dir, `${nameWithoutExt} (${counter})${ext}`);
    counter++;
  } while (await fs.pathExists(newFilePath));
  
  return newFilePath;
}

/**
 * Display file information in a formatted way
 * @param {object} fileInfo - File information object
 */
export function displayFileInfo(fileInfo) {
  console.log(chalk.cyan('\n📄 File Information:'));
  console.log(chalk.gray('  Name:'), chalk.white(fileInfo.name));
  console.log(chalk.gray('  Size:'), chalk.white(fileInfo.formattedSize));
  console.log(chalk.gray('  Path:'), chalk.white(fileInfo.path));
  
  if (fileInfo.extension) {
    console.log(chalk.gray('  Type:'), chalk.white(fileInfo.extension.substring(1).toUpperCase()));
  }
  
  console.log(chalk.gray('  Modified:'), chalk.white(fileInfo.modified.toLocaleString()));
  console.log();
}

/**
 * Display upload result information
 * @param {object} result - Upload result
 * @param {object} fileInfo - File information
 */
export function displayUploadResult(result, fileInfo) {
  if (result.success) {
    console.log(chalk.green('\n🎉 Upload Successful!'));
    console.log(chalk.gray('  File:'), chalk.white(fileInfo.name));
    console.log(chalk.gray('  Size:'), chalk.white(fileInfo.formattedSize));
    console.log(chalk.gray('  File Code:'), chalk.yellow.bold(result.fileCode));
    console.log();
    console.log(chalk.cyan('📋 To download this file, use:'));
    console.log(chalk.white(`  npx shareio get ${result.fileCode}`));
    
    if (result.data?.password) {
      console.log(chalk.white(`  npx shareio get ${result.fileCode} --pass YOUR_PASSWORD`));
    }
    
    console.log();
    showInfo('Keep the file code safe - you\'ll need it to download the file!');
  } else {
    showError(`Upload failed: ${result.error}`);
    if (result.suggestion) {
      showInfo(result.suggestion);
    }
  }
}

/**
 * Display download result information
 * @param {object} result - Download result
 */
export function displayDownloadResult(result) {
  if (result.success) {
    console.log(chalk.green('\n🎉 Download Successful!'));
    console.log(chalk.gray('  File:'), chalk.white(result.fileName));
    console.log(chalk.gray('  Location:'), chalk.white(result.filePath));
    console.log();
    showSuccess(`File downloaded to: ${result.filePath}`);
  } else {
    showError(`Download failed: ${result.error}`);
    if (result.suggestion) {
      showInfo(result.suggestion);
    }
  }
}

/**
 * Clean up temporary files
 * @param {string[]} filePaths - Array of file paths to clean up
 */
export async function cleanupFiles(filePaths) {
  for (const filePath of filePaths) {
    try {
      if (await fs.pathExists(filePath)) {
        await fs.remove(filePath);
      }
    } catch (error) {
      // Silently ignore cleanup errors
      console.warn(chalk.yellow(`Warning: Could not clean up ${filePath}`));
    }
  }
}

/**
 * Calculate file checksum (for future integrity verification)
 * @param {string} filePath - Path to the file
 * @param {string} algorithm - Hash algorithm (default: sha256)
 * @returns {Promise<string>} File checksum
 */
export async function calculateChecksum(filePath, algorithm = 'sha256') {
  try {
    const crypto = await import('crypto');
    const hash = crypto.createHash(algorithm);
    const stream = fs.createReadStream(filePath);
    
    return new Promise((resolve, reject) => {
      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  } catch (error) {
    throw new Error(`Failed to calculate checksum: ${error.message}`);
  }
}
