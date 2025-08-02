/**
 * ShareIO CLI Main Entry Point
 * Sets up commander.js and handles CLI commands
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

// Import commands
import { postCommand } from './commands/post.js';
import { getCommand } from './commands/get.js';

// Load environment variables
dotenv.config();

// Get package.json info
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packagePath = join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));

// Create the main program
const program = new Command();

// Set up the CLI
program
  .name('shareio')
  .description(chalk.cyan('🚀 CLI based P2P file sharing tool'))
  .version(packageJson.version, '-v, --version', 'display version number');

// Add post command
program
  .command('post')
  .description(chalk.green('📤 Upload and share a file'))
  .argument('<file>', 'path to the file to share')
  .option('-p, --pass <password>', 'password to protect the file')
  .action(postCommand);

// Add get command
program
  .command('get')
  .description(chalk.blue('📥 Download a shared file'))
  .argument('<code>', 'file code (port number) to download')
  .option('-p, --pass <password>', 'password to unlock the file')
  .option('-o, --output <path>', 'output directory', process.cwd())
  .action(getCommand);

// Add help examples
program.addHelpText('after', `
${chalk.yellow('Examples:')}
  ${chalk.gray('$')} npx shareio post ./document.pdf
  ${chalk.gray('$')} npx shareio post ./document.pdf --pass 1234
  ${chalk.gray('$')} npx shareio get 8081
  ${chalk.gray('$')} npx shareio get 8081 --pass 1234
  ${chalk.gray('$')} npx shareio get 8081 -o ./downloads/
`);

// Handle unknown commands
program.on('command:*', () => {
  console.error(chalk.red('❌ Invalid command: %s'), program.args.join(' '));
  console.log(chalk.yellow('💡 See --help for a list of available commands.'));
  process.exit(1);
});

// Parse CLI arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
