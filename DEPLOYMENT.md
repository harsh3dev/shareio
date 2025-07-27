# File2go Deployment Guide

## GitHub Actions CI/CD Pipeline

This project uses GitHub Actions for automated testing, building, and deployment.

### Required GitHub Secrets

Before the pipeline can work, you need to set up these secrets in your GitHub repository:

1. **DOCKERHUB_USERNAME** - Your Docker Hub username
2. **DOCKERHUB_TOKEN** - Your Docker Hub access token (not password)
3. **SERVER_IP** - Your deployment server's IP address
4. **SSH_PRIVATE_KEY** - Private SSH key for accessing your server

### Setting up GitHub Secrets

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret" for each secret above

### Pipeline Overview

The CI/CD pipeline consists of three jobs:

1. **Test** - Runs Maven tests for the Java application
2. **Build & Push** - Builds Docker image and pushes to Docker Hub
3. **Deploy** - Deploys to your server via SSH

### Server Setup Requirements

Your deployment server should have:

1. Docker and Docker Compose installed
2. Project files in `/opt/file2go/` directory
3. SSH access configured for the user specified in `DROPLET_USER`

### Manual Deployment

To deploy manually:

```bash
# On your server
cd /opt/file2go
docker-compose pull share-service
docker-compose up -d share-service nginx
```

### Local Development

```bash
# Build and run locally
cd share-service
mvn clean package
docker-compose up --build
```

The application will be available at:
- Service: http://localhost:8080
- Nginx: http://localhost:80

### Docker Hub Image

The pipeline pushes images to: `harsh3dev/file2go-share-service`

Tags:
- `latest` - Latest stable version
- `<commit-sha>` - Specific commit version
