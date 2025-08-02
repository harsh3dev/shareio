/**
 * POST command - Upload and share a file
 */

import chalk from 'chalk';
import { validateFile, validatePassword, handleValidationError } from '../utils/validation.js';
import { showInfo, showError, createSpinner } from '../utils/progress.js';
import { uploadFile, checkServiceHealth } from '../services/apiClient.js';
import { getFileInfo, displayFileInfo, displayUploadResult } from '../services/fileService.js';
import { config } from '../utils/config.js';

/**
 * Handle the post command
 * @param {string} filePath - Path to the file to upload
 * @param {object} options - Command options
 */
export async function postCommand(filePath, options) {
  try {
    console.log(chalk.cyan('🚀 ShareIO - File Upload\n'));

    // Extract options (only password is available now)
    const { pass: password } = options;

    // Validate inputs
    const fileValidation = await validateFile(filePath);
    if (!fileValidation.isValid) {
      handleValidationError(fileValidation.error);
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      handleValidationError(passwordValidation.error);
    }

    // Get and display file information
    const fileInfoResult = await getFileInfo(fileValidation.path);
    if (!fileInfoResult.success) {
      handleValidationError(fileInfoResult.error);
    }

    displayFileInfo(fileInfoResult.info);

    // Check if backend service is available
    showInfo('Checking backend service availability...');
    const healthCheck = await checkServiceHealth();
    if (!healthCheck.success) {
      showError(healthCheck.error);
      if (healthCheck.suggestion) {
        showInfo(healthCheck.suggestion);
      }
      process.exit(1);
    }

    // Confirm upload
    if (passwordValidation.password) {
      showInfo('File will be uploaded with password protection');
    } else {
      showInfo('File will be uploaded without password protection');
    }

    // Create spinner for upload
    const spinner = createSpinner(`📤 Uploading ${fileInfoResult.info.name}...`);

    // Upload file
    const uploadResult = await uploadFile(
      fileValidation.path,
      passwordValidation.password
    );

    // Stop spinner and show result
    if (uploadResult.success) {
      spinner.succeed(`✅ Uploaded ${fileInfoResult.info.name}`);
    } else {
      spinner.fail(`❌ Failed to upload ${fileInfoResult.info.name}`);
    }

    // Display result
    displayUploadResult(uploadResult, fileInfoResult.info);

    // Exit with appropriate code
    process.exit(uploadResult.success ? 0 : 1);

  } catch (error) {
    console.error(chalk.red('\n❌ Unexpected error:'), error.message);
    
    if (process.env.NODE_ENV === 'development') {
      console.error(chalk.gray(error.stack));
    }
    
    process.exit(1);
  }
}
