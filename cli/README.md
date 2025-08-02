# ShareIO CLI

🚀 A powerful CLI tool for peer-to-peer file sharing with password protection and progress tracking.

## Features

- **Easy file sharing**: Upload files with a simple command
- **Password protection**: Secure your files with optional passwords
- **Progress tracking**: Real-time upload/download progress indicators
- **Cross-platform**: Works on Windows, macOS, and Linux
- **Lightweight**: Minimal dependencies, fast performance

## Installation

```bash
# Install globally
npm install -g shareio

# Or use without installation
npx shareio --help
```

## Usage

### Upload a file

```bash
# Basic upload
npx shareio post ./document.pdf

# Upload with password protection
npx shareio post ./document.pdf --pass 1234
```

### Download a file

```bash
# Basic download
npx shareio get 8081

# Download with password
npx shareio get 8081 --pass 1234

# Download to specific directory
npx shareio get 8081 -o ./downloads/

# Download from custom backend
npx shareio get 8081 --host example.com
```

## Commands

### `post <file>`

Upload and share a file.

**Arguments:**
- `file` - Path to the file to upload

**Options:**
- `-p, --pass <password>` - Password to protect the file

**Example:**
```bash
npx shareio post ./my-file.pdf --pass secretpassword
```

### `get <code>`

Download a shared file using its file code.

**Arguments:**
- `code` - File code (port number) received when uploading

**Options:**
- `-p, --pass <password>` - Password to unlock the file
- `-o, --output <path>` - Output directory (default: current directory)
- `--host <host>` - Backend service host (default: localhost)

**Example:**
```bash
npx shareio get 8081 --pass secretpassword -o ./downloads/
```

## Configuration

You can configure ShareIO CLI using environment variables or a `.env` file:

```env
# Backend Service Configuration
SHAREIO_HOST=localhost
SHAREIO_PORT=8080
SHAREIO_PROTOCOL=http
SHAREIO_TIMEOUT=30000

# Upload Configuration
MAX_FILE_SIZE=104857600  # 100MB
UPLOAD_RETRIES=3

# Download Configuration
DOWNLOAD_TIMEOUT=60000
DOWNLOAD_RETRIES=3

# Disable colored output
NO_COLOR=false
```

## Backend Service

ShareIO CLI requires a backend service to handle file transfers. Make sure the ShareIO backend service is running before using the CLI.

### Starting the Backend

```bash
# If using Docker
docker-compose up -d

# Or if running locally
cd share-service
mvn spring-boot:run
```

## Examples

### Basic Workflow

1. **Upload a file:**
   ```bash
   $ npx shareio post ./presentation.pptx --pass mypassword
   🚀 ShareIO - File Upload
   
   📄 File Information:
     Name: presentation.pptx
     Size: 2.45 MB
     Path: /home/user/presentation.pptx
     Type: PPTX
   
   📤 Uploading presentation.pptx ████████████████████ 100% | 2.45/2.45 MB
   
   🎉 Upload Successful!
     File: presentation.pptx
     Size: 2.45 MB
     File Code: 8081
   
   📋 To download this file, use:
     npx shareio get 8081 --pass mypassword
   ```

2. **Download the file:**
   ```bash
   $ npx shareio get 8081 --pass mypassword
   📥 ShareIO - File Download
   
     File Code: 8081
     Download to: /home/user/downloads
     Password: **********
   
   📄 File Information:
     Name: presentation.pptx
     Size: 2.45 MB
   
   📥 Downloading presentation.pptx ████████████████████ 100% | 2.45/2.45 MB
   
   🎉 Download Successful!
     File: presentation.pptx
     Location: /home/user/downloads/presentation.pptx
   ```

## Error Handling

ShareIO CLI provides detailed error messages and suggestions:

- **File not found**: Check file path and permissions
- **Service unavailable**: Ensure backend service is running
- **Invalid file code**: Verify the file code is correct
- **Wrong password**: Check the password for protected files
- **Network errors**: Check internet connection and firewall settings

## Development

### Prerequisites

- Node.js 18.0.0 or higher
- ShareIO backend service running

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd shareio/cli

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env

# Run in development mode
npm run dev
```

### Testing

```bash
# Run tests
npm test

# Test CLI commands
npm run dev post ./test-file.txt
npm run dev get 8081
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see [LICENSE](../LICENSE) file for details.

## Support

- 📧 Email: support@shareio.dev
- 🐛 Issues: [GitHub Issues](https://github.com/harsh3dev/shareio/issues)
- 📖 Documentation: [Wiki](https://github.com/harsh3dev/shareio/wiki)

---

Made with ❤️ by [Harsh Pandey](https://github.com/harsh3dev)
