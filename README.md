### TODO:

#### Phase 1:
- [ ] update cors of share-service to only allow the cli access
- [ ] Deploy the cli and latest share-service to prod
- [ ] Publish the package to npm registry
- [ ] vibe code basic landing page and deploy
- [ ] Test the prod
- [ ] Update the root README

#### Phase 2:
- [ ] write unit tests for the cli
- [ ] find edge cases and scalability issues
- [ ] improve the scalability

#### Phase 3:
- [ ] find potential security pitfalls
- [ ] improve the security



### RAW Notes
the cli app will contain these features
- a cli based tool which could accept the following commands -> post and get
- it will be used like `npx shareio post <file\_location> --pass 1234`
- where shareio is the name of the package
- post is the command to send the file
- pass is optional parameter which will be the password to lock the file
- similarly `npx shareio get <file_code> --pass 1234`
- here file code will be the port number which will be received when doing post
- get will be used to download the file and will be downloaded in the current directory
- it will then print on the terminal the location of the downloaded file
- when doing post the terminal will be showing the progress of the file upload

the client will send the password initially
and then we have to check in the backend
if there is a password  attached to the file which we can know from the hashmap
then check the password match or not
if match then normally process the file
else if doesn't match simply return the error response
if the file doesn't have a password attached for now simply just process the file no over engineering


---
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
