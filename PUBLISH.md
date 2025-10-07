# Publishing Prisma Remote MCP Server to Official Registry

This guide provides step-by-step instructions for publishing the Prisma remote MCP server to the official Model Context Protocol (MCP) registry.

## Overview

This repository contains configuration for publishing Prisma's **remote MCP server** (hosted at `https://mcp.prisma.io/mcp`) to the official MCP registry. This is distinct from the local MCP server that's part of the Prisma ORM NPM package.

### What Gets Published

- **Remote MCP Server**: A cloud-hosted MCP server accessible at `https://mcp.prisma.io/mcp`
- **Authentication Required**: Requires Bearer token authentication via Prisma platform
- **Endpoints**: Both SSE (`/sse`) and streamable-http (`/mcp`) protocols supported

## Prerequisites

### 1. DNS Authentication Setup

Since we're using the namespace `io.prisma/mcp`, we need DNS authentication for the `prisma.io` domain.

**Required GitHub Secret:**
- `MCP_PUBLISH_PRIVATE_KEY`: The private key for DNS authentication

### 2. DNS TXT Record

Ensure the following DNS TXT record is configured for `prisma.io`:

```
_mcp-publisher.prisma.io TXT "v=mcp1; pub-key=<PUBLIC_KEY>"
```

Where `<PUBLIC_KEY>` is the public key corresponding to the private key stored in GitHub secrets.

## First-Time Setup

### Step 1: Generate Key Pair (If Not Already Done)

If you need to generate a new key pair for DNS authentication:

```bash
# Generate private key
openssl genpkey -algorithm Ed25519 -out private-key.pem

# Extract public key
openssl pkey -in private-key.pem -pubout -outform DER | base64 -w 0
```

### Step 2: Configure DNS Record

Add the TXT record to `prisma.io` DNS configuration:

```
_mcp-publisher.prisma.io TXT "v=mcp1; pub-key=<BASE64_PUBLIC_KEY>"
```

### Step 3: Add GitHub Secret

1. Go to the repository settings: `https://github.com/prisma/mcp/settings/secrets/actions`
2. Click "New repository secret"
3. Name: `MCP_PUBLISH_PRIVATE_KEY`
4. Value: The contents of your `private-key.pem` file (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines)

## Publishing Process

### Automated Publishing (Recommended)

The repository is configured with GitHub Actions for automated publishing:

#### For New Versions:

1. **Update Version**: Update the `version` field in `server.json`
   ```json
   {
     "version": "1.0.1",
     ...
   }
   ```

2. **Commit Changes**:
   ```bash
   git add server.json
   git commit -m "chore: bump version to 1.0.1"
   git push origin main
   ```

3. **Create and Push Tag**:
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```

4. **Monitor Workflow**: Check the Actions tab to monitor the publishing process

#### For Manual Trigger:

You can also trigger publishing manually from the GitHub Actions UI:

1. Go to Actions tab in the repository
2. Select "Publish to MCP Registry" workflow
3. Click "Run workflow"
4. Select the branch and click "Run workflow"

### What the Workflow Does

The automated workflow:

1. ✅ **Validates** `server.json` syntax and structure
2. 🔍 **Checks** remote endpoint accessibility 
3. 📦 **Installs** MCP Publisher CLI
4. 🔐 **Authenticates** using DNS method with private key
5. 🚀 **Publishes** to the MCP registry
6. 🧹 **Cleans up** temporary files securely

### Manual Publishing (If Needed)

If you need to publish manually:

1. **Install MCP Publisher**:
   ```bash
   curl -L "https://github.com/modelcontextprotocol/registry/releases/download/v1.0.0/mcp-publisher_1.0.0_$(uname -s | tr '[:upper:]' '[:lower:]')_$(uname -m | sed 's/x86_64/amd64/;s/aarch64/arm64/').tar.gz" | tar xz mcp-publisher
   ```

2. **Authenticate**:
   ```bash
   # Extract private key from GitHub secret or file
   echo "$MCP_PUBLISH_PRIVATE_KEY" > key.pem
   
   # Login using DNS authentication
   ./mcp-publisher login dns --domain prisma.io --private-key $(openssl pkey -in key.pem -noout -text | grep -A3 "priv:" | tail -n +2 | tr -d ' :\n')
   ```

3. **Publish**:
   ```bash
   ./mcp-publisher publish
   ```

4. **Clean up**:
   ```bash
   rm -f key.pem
   ```

## Configuration Files

### server.json

The `server.json` file contains the metadata for the remote MCP server:

```json
{
  "$schema": "https://static.modelcontextprotocol.io/schemas/2025-09-16/server.schema.json",
  "name": "io.prisma/mcp",
  "description": "MCP server for managing Prisma Postgres.",
  "version": "1.0.0",
  "remotes": [
    {
      "type": "sse",
      "url": "https://mcp.prisma.io/sse",
      "headers": [
        {
          "name": "Authorization",
          "description": "Bearer token for Prisma platform authentication",
          "isRequired": true,
          "isSecret": true
        }
      ]
    },
    {
      "type": "streamable-http", 
      "url": "https://mcp.prisma.io/mcp",
      "headers": [
        {
          "name": "Authorization",
          "description": "Bearer token for Prisma platform authentication", 
          "isRequired": true,
          "isSecret": true
        }
      ]
    }
  ]
}
```

### Key Configuration Points:

- **Namespace**: `io.prisma/mcp` (requires DNS authentication for `prisma.io`)
- **Remote Endpoints**: Both SSE and streamable-http protocols
- **Authentication**: Bearer token required for both endpoints
- **URLs**: Point to the production Prisma platform MCP service

## Troubleshooting

### Common Issues

#### 1. Authentication Failure
```
Error: DNS authentication failed
```
**Solution**: Verify that:
- The TXT record is properly configured for `_mcp-publisher.prisma.io`
- The private key in GitHub secrets matches the public key in DNS
- DNS propagation is complete (may take up to 24 hours)

#### 2. Invalid server.json
```
Error: Invalid server configuration
```
**Solution**: 
- Validate JSON syntax using `python3 -m json.tool server.json`
- Ensure all required fields are present
- Check that URLs are accessible

#### 3. Endpoint Validation Warnings
```
⚠️ Endpoint may require authentication: https://mcp.prisma.io/mcp
```
**This is expected** for authenticated endpoints. The workflow will continue normally.

#### 4. Tag Already Exists
```
Error: tag already exists
```
**Solution**:
- Use a new version number
- Or delete the existing tag: `git tag -d v1.0.1 && git push origin :refs/tags/v1.0.1`

### Verification

After successful publishing, verify your server appears in the registry:

1. Search for "prisma" in the [MCP Registry](https://github.com/modelcontextprotocol/registry)
2. Check that the server metadata is correct
3. Verify the remote endpoints are listed properly

## Security Considerations

- **Private Key**: Never commit the private key to the repository
- **GitHub Secrets**: Use repository secrets for sensitive information
- **Key Rotation**: Rotate DNS authentication keys periodically
- **Access Control**: Limit who can create new releases/tags

## Team Workflow

### For Regular Updates:

1. **Update** `server.json` with new version and any configuration changes
2. **Test** locally if possible
3. **Create PR** with changes
4. **After merge**: Create and push version tag to trigger publishing

### For Emergency Updates:

1. **Make changes** directly to main branch (if needed)
2. **Immediately tag** and push to trigger emergency publish
3. **Follow up** with proper documentation and team notification

## Support

For issues with:
- **MCP Registry**: Check [registry documentation](https://github.com/modelcontextprotocol/registry)
- **GitHub Actions**: Check workflow logs in Actions tab
- **Prisma Platform**: Contact platform team for endpoint issues
- **DNS Configuration**: Contact infrastructure team for DNS changes

---

*Last updated: $(date)*