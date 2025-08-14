# ZEP Memory Node v3 - Installation Guide

This guide provides step-by-step instructions for installing and configuring the ZEP Memory node for n8n.

## Prerequisites

Before installing, ensure you have:

- **n8n**: Version 0.190.0 or higher
- **Node.js**: Version 18.10.0 or higher  
- **pnpm**: Version 7.18.0 or higher (recommended) or npm
- **ZEP Account**: Access to ZEP Memory service with API key

## Installation Methods

### Method 1: Install from npm (Recommended)

```bash
# In your n8n installation directory
npm install n8n-nodes-zep-v3

# Or with pnpm
pnpm add n8n-nodes-zep-v3
```

### Method 2: Install from Source

1. **Clone the repository:**

   ```bash
   git clone https://github.com/getzep/n8n-nodes-zep-v3.git
   cd n8n-nodes-zep-v3
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Build the node:**

   ```bash
   pnpm build
   # or
   npm run build
   ```

4. **Link to your n8n installation:**

   ```bash
   # Navigate to your n8n installation directory
   cd /path/to/your/n8n
   
   # Install the local package
   npm install /path/to/n8n-nodes-zep-v3
   ```

### Method 3: Community Package (n8n Cloud/Self-hosted)

1. In n8n, go to **Settings** → **Community Nodes**
2. Click **Install a community package**
3. Enter: `n8n-nodes-zep-v3`
4. Click **Install**

## Configuration

### 1. Restart n8n

After installation, restart your n8n instance:

```bash
# For self-hosted installations
pm2 restart n8n

# For Docker installations  
docker restart n8n

# For development
npm run dev
```

### 2. Configure ZEP API Credentials

1. **Get your ZEP API key:**
   - Log into your ZEP dashboard
   - Navigate to API settings
   - Copy your API key

2. **Create credentials in n8n:**
   - Go to **Settings** → **Credentials**
   - Click **Create New Credential**
   - Search for "ZEP API" and select it
   - Fill in the required fields:
     - **API Key**: Your ZEP API key
     - **Base URL**: `https://api.getzep.com` (or your custom ZEP instance URL)
     - **Project UUID**: (Optional) Your project UUID

3. **Test the connection:**
   - Click **Test** to verify the credentials work
   - Save the credential with a descriptive name

### 3. Verify Installation

1. **Create a new workflow**
2. **Add a new node** by clicking the "+" button
3. **Search for "ZEP Memory"** - it should appear in the results
4. **Add the node** and select your ZEP API credential
5. **Test a simple operation** like "List Threads"

## Development Setup

For development and testing:

### 1. Development Dependencies

```bash
pnpm install --dev
# or
npm install --save-dev
```

### 2. Development Scripts

```bash
# Watch mode for development
pnpm dev
# or
npm run dev

# Run linting
pnpm lint
# or
npm run lint

# Run tests
pnpm test
# or
npm test

# Format code
pnpm format
# or
npm run format
```

### 3. Link for Local Development

```bash
# In the node package directory
pnpm link

# In your n8n directory
pnpm link n8n-nodes-zep-v3
```

## Troubleshooting

### Common Issues

**1. Node not appearing in n8n**  

- Ensure n8n was restarted after installation
- Check that the package is properly installed: `npm list n8n-nodes-zep-v3`
- Verify the package.json n8n configuration is correct

**2. Build errors**  

- Ensure you have TypeScript installed: `npm install -g typescript`
- Check Node.js version: `node --version` (should be 18.10.0+)
- Clear node_modules and reinstall: `rm -rf node_modules && pnpm install`

**3. Credential test fails**  

- Verify your API key is correct
- Check the base URL format (should include https://)
- Ensure your ZEP instance is accessible
- Check for network/firewall issues

**4. Permission errors**  

- On Linux/Mac, you may need to use `sudo` for global installations
- Consider using a Node.js version manager like nvm
- Check file permissions: `chmod +x node_modules/.bin/*`

### Debug Mode

Enable debug logging in n8n:

```bash
# Set environment variable
export N8N_LOG_LEVEL=debug

# Or add to your .env file
N8N_LOG_LEVEL=debug
```

### Logs Location

Check these locations for error logs:

- **n8n logs**: Usually in `~/.n8n/logs/`
- **npm logs**: Check `npm-debug.log` in your current directory
- **Console output**: When running n8n in development mode

## Uninstallation

To remove the ZEP node:

```bash
# Remove the package
npm uninstall n8n-nodes-zep-v3

# Or with pnpm
pnpm remove n8n-nodes-zep-v3

# Restart n8n
pm2 restart n8n
```

## Environment-Specific Instructions

### Docker Installation

Add to your Dockerfile:

```dockerfile
# Install the ZEP node
RUN cd /usr/local/lib/node_modules/n8n && npm install n8n-nodes-zep-v3

# Or using a custom package.json
COPY package.json .
RUN npm install
```

### n8n Cloud

For n8n Cloud instances:

1. Use the Community Packages feature in the web interface
2. Community packages are automatically managed
3. No manual installation required

### Self-Hosted with PM2

```bash
# Stop n8n
pm2 stop n8n

# Install the package
cd /path/to/n8n && npm install n8n-nodes-zep-v3

# Start n8n
pm2 start n8n
```

## Version Compatibility

| ZEP Node Version | n8n Version | Node.js Version |
|------------------|-------------|-----------------|
| 1.0.x            | 0.190.0+    | 18.10.0+        |

## Support

If you encounter issues:

1. **Check the logs** for error messages
2. **Verify versions** are compatible
3. **Test credentials** independently using curl or Postman
4. **Search existing issues** on GitHub
5. **Create a new issue** with detailed information

### Issue Template

When reporting issues, include:

- n8n version: `n8n --version`
- Node.js version: `node --version`
- ZEP node version: `npm list n8n-nodes-zep-v3`
- Operating system
- Error messages and stack traces
- Steps to reproduce the issue

## Next Steps

After successful installation:

1. **Read the README.md** for usage instructions
2. **Check EXAMPLES.md** for practical workflow examples
3. **Review the API documentation** for advanced features
4. **Join the community** for support and discussions

The ZEP Memory node is now ready to use in your n8n workflows!
