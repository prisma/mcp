# Publishing Prisma Remote MCP Server

This guide covers publishing Prisma's remote MCP server (hosted at `https://mcp.prisma.io/mcp`) to the official MCP registry.

## Prerequisites

**GitHub Secret Required:**
- `MCP_PUBLISH_PRIVATE_KEY`: DNS authentication private key for `prisma.io` domain

**DNS Configuration:**
Ensure this TXT record exists for `prisma.io`:
```
_mcp-publisher.prisma.io TXT "v=mcp1; pub-key=<PUBLIC_KEY>"
```

## First-Time Setup

**If generating new keys:**
```bash
# Generate private key
openssl genpkey -algorithm Ed25519 -out private-key.pem

# Extract public key for DNS
openssl pkey -in private-key.pem -pubout -outform DER | base64 -w 0
```

**Configure:**
1. Add DNS TXT record with public key
2. Add private key content to GitHub secret `MCP_PUBLISH_PRIVATE_KEY`

## Publishing

### Automated Publishing (Recommended)

**For new versions:**
1. Update `version` in [`server.json`](./server.json)
2. Commit and push changes
3. Create and push version tag:
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```

**Manual trigger:** Use GitHub Actions UI → "Publish to MCP Registry" → "Run workflow"

### Workflow Process
1. Validates `server.json` and checks endpoints
2. Authenticates with DNS method
3. Publishes to MCP registry

### Manual Publishing (If Needed)

```bash
# Install MCP Publisher
curl -L "https://github.com/modelcontextprotocol/registry/releases/download/v1.0.0/mcp-publisher_1.0.0_$(uname -s | tr '[:upper:]' '[:lower:]')_$(uname -m | sed 's/x86_64/amd64/;s/aarch64/arm64/').tar.gz" | tar xz mcp-publisher

# Authenticate and publish
echo "$MCP_PUBLISH_PRIVATE_KEY" > key.pem
./mcp-publisher login dns --domain prisma.io --private-key $(openssl pkey -in key.pem -noout -text | grep -A3 "priv:" | tail -n +2 | tr -d ' :\n')
./mcp-publisher publish
rm -f key.pem
```

## Troubleshooting

**Authentication failure:** Verify DNS TXT record and key matching

**Invalid server.json:** Validate with `python3 -m json.tool server.json`

**Endpoint warnings:** Expected for authenticated endpoints

**Tag exists:** Use new version or delete existing tag

## Verification

After publishing, search for "prisma" in the [MCP Registry](https://github.com/modelcontextprotocol/registry) to verify the server appears correctly.

## Support

- **MCP Registry issues:** [Registry docs](https://github.com/modelcontextprotocol/registry)
- **GitHub Actions:** Check workflow logs
- **Prisma Platform:** Contact platform team
- **DNS Configuration:** Contact infrastructure team