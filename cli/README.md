# ShareIO CLI

🚀 A powerful CLI tool for peer-to-peer file sharing with password protection and progress tracking.

## Features

- **Easy file sharing**: Upload files with a simple command
- **Password protection**: Secure your files with optional passwords
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

# or
npx shareio post ./document.pdf --p 1234
```

### Download a file

```bash
# Basic download
npx shareio get <file_code>

# Download with password
npx shareio get <file_code> --pass 1234

# or
npx shareio get <file_code> --p 1234

# Download to specific directory
npx shareio get <file_code> -o ./downloads/

# you will get a file code upon file upload

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
- `code` - File code received when uploading

**Options:**
- `-p, --pass <password>` - Password to unlock the file
- `-o, --output <path>` - Output directory (default: current directory)

**Example:**
```bash
npx shareio get 60815 --pass secretpassword -o ./downloads/
```


## License

MIT License - see [LICENSE](../LICENSE) file for details.

## Support

- 📧 Email: harshpandey.tech@gmail.com[](mailto:harshpandey.tech@gmail.com)
- 🐛 Issues: [GitHub Issues](https://github.com/harsh3dev/shareio/issues)
- 📖 Documentation: [Wiki](https://github.com/harsh3dev/shareio/wiki)

---

Made with ❤️ by [Harsh Pandey](https://github.com/harsh3dev)
