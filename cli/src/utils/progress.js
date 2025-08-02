/**
 * Progress tracking utilities for ShareIO CLI
 */

import cliProgress from 'cli-progress';
import chalk from 'chalk';
import ora from 'ora';

/**
 * Create a progress bar for file uploads
 * @param {string} fileName - Name of the file being uploaded
 * @param {number} totalSize - Total size of the file
 * @returns {object} Progress bar instance
 */
export function createUploadProgressBar(fileName, totalSize) {
  const progressBar = new cliProgress.SingleBar({
    format: `${chalk.cyan('📤 Uploading')} ${chalk.yellow(fileName)} | ${chalk.green('{bar}')} | {percentage}% | {value}/{total} MB | ETA: {eta}s`,
    barCompleteChar: '█',
    barIncompleteChar: '░',
    hideCursor: true,
    clearOnComplete: false,
    stopOnComplete: true,
  }, cliProgress.Presets.shades_classic);

  // Convert bytes to MB for display
  const totalMB = Math.round((totalSize / (1024 * 1024)) * 100) / 100;
  progressBar.start(totalMB, 0);

  return {
    update: (uploadedBytes) => {
      const uploadedMB = Math.round((uploadedBytes / (1024 * 1024)) * 100) / 100;
      progressBar.update(uploadedMB);
    },
    stop: () => {
      progressBar.stop();
    }
  };
}

/**
 * Create a progress bar for file downloads
 * @param {string} fileName - Name of the file being downloaded
 * @param {number} totalSize - Total size of the file (if known)
 * @returns {object} Progress bar instance
 */
export function createDownloadProgressBar(fileName, totalSize = null) {
  if (!totalSize) {
    // Use spinner if size is unknown
    const spinner = ora({
      text: `${chalk.cyan('📥 Downloading')} ${chalk.yellow(fileName)}...`,
      spinner: 'dots'
    }).start();

    return {
      update: (message) => {
        if (message) {
          spinner.text = `${chalk.cyan('📥 Downloading')} ${chalk.yellow(fileName)}... ${message}`;
        }
      },
      stop: () => {
        spinner.stop();
      },
      succeed: (message) => {
        spinner.succeed(message || `${chalk.green('✅ Downloaded')} ${chalk.yellow(fileName)}`);
      },
      fail: (message) => {
        spinner.fail(message || `${chalk.red('❌ Failed to download')} ${chalk.yellow(fileName)}`);
      }
    };
  }

  // Use progress bar if size is known
  const progressBar = new cliProgress.SingleBar({
    format: `${chalk.cyan('📥 Downloading')} ${chalk.yellow(fileName)} | ${chalk.green('{bar}')} | {percentage}% | {value}/{total} MB | ETA: {eta}s`,
    barCompleteChar: '█',
    barIncompleteChar: '░',
    hideCursor: true,
    clearOnComplete: false,
    stopOnComplete: true,
  }, cliProgress.Presets.shades_classic);

  const totalMB = Math.round((totalSize / (1024 * 1024)) * 100) / 100;
  progressBar.start(totalMB, 0);

  return {
    update: (downloadedBytes) => {
      const downloadedMB = Math.round((downloadedBytes / (1024 * 1024)) * 100) / 100;
      progressBar.update(downloadedMB);
    },
    stop: () => {
      progressBar.stop();
    }
  };
}

/**
 * Create a simple spinner
 * @param {string} text - Spinner text
 * @returns {object} Spinner instance
 */
export function createSpinner(text) {
  const spinner = ora({
    text,
    spinner: 'dots'
  }).start();

  return {
    updateText: (newText) => {
      spinner.text = newText;
    },
    succeed: (message) => {
      spinner.succeed(message);
    },
    fail: (message) => {
      spinner.fail(message);
    },
    stop: () => {
      spinner.stop();
    }
  };
}

/**
 * Show success message
 * @param {string} message - Success message
 */
export function showSuccess(message) {
  console.log(chalk.green('✅', message));
}

/**
 * Show error message
 * @param {string} message - Error message
 */
export function showError(message) {
  console.error(chalk.red('❌', message));
}

/**
 * Show info message
 * @param {string} message - Info message
 */
export function showInfo(message) {
  console.log(chalk.blue('ℹ️', message));
}

/**
 * Show warning message
 * @param {string} message - Warning message
 */
export function showWarning(message) {
  console.log(chalk.yellow('⚠️', message));
}
