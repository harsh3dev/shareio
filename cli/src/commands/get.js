/**
 * GET command - Download a shared file
 */

import chalk from 'chalk';
import path from 'path';
import { 
  validateFileCode, 
  validatePassword, 
  validateOutputDirectory, 
  handleValidationError 
} from '../utils/validation.js';
import { 
  showInfo, 
  showError, 
  createSpinner 
} from '../utils/progress.js';
import { downloadFile } from '../services/apiClient.js';
import { 
  generateUniqueFilename, 
  displayDownloadResult
} from '../services/fileService.js';
import { config } from '../utils/config.js';

/**
 * Handle the get command
 * @param {string} fileCode - File code (port number) to download
 * @param {object} options - Command options
 */
export async function getCommand(fileCode, options) {
  try {
    console.log(chalk.cyan('📥 ShareIO - File Download\n'));

    // Extract options
    const { pass: password, output: outputPath } = options;

    // Validate inputs
    const codeValidation = validateFileCode(fileCode);
    if (!codeValidation.isValid) {
      handleValidationError(codeValidation.error);
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      handleValidationError(passwordValidation.error);
    }

    const outputValidation = await validateOutputDirectory(outputPath);
    if (!outputValidation.isValid) {
      handleValidationError(outputValidation.error);
    }

    // Show download information
    console.log(chalk.gray('  File Code:'), chalk.yellow(fileCode));
    console.log(chalk.gray('  Download to:'), chalk.white(outputValidation.path));
    if (password) {
      console.log(chalk.gray('  Password:'), chalk.white('*'.repeat(password.length)));
    }
    console.log();

    // Create spinner for download
    const spinner = createSpinner(`📥 Downloading file...`);

    // Download file
    const downloadResult = await downloadFile(
      codeValidation.port,
      passwordValidation.password,
      outputValidation.path
    );

    // Stop spinner and show result
    if (downloadResult.success) {
      spinner.succeed(`✅ Downloaded: ${downloadResult.fileName}`);
    } else {
      spinner.fail(`❌ Download failed: ${downloadResult.error}`);
    }

    // Display result
    displayDownloadResult(downloadResult);

    // Exit with appropriate code
    process.exit(downloadResult.success ? 0 : 1);

  } catch (error) {
    console.error(chalk.red('\n❌ Unexpected error:'), error.message);
    
    if (process.env.NODE_ENV === 'development') {
      console.error(chalk.gray(error.stack));
    }
    
    process.exit(1);
  }
}
