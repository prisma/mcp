# Prisma Desktop Extension for Claude

## Overview

This extension enables you to manage Prisma Postgres databases and Prisma ORM workflows from within Claude Desktop.

## Features

### Prisma Postgres Platform
- **Prisma-Postgres-account-status**: Check authentication and connection status
- **Create-Prisma-Postgres-Database**: Create new Prisma Postgres databases
- **Prisma-Login**: Sign in to Prisma Console for cloud features

### Database Migrations
- **migrate-status**: Check the status of your database migrations
- **migrate-dev**: Create and apply database migrations in development
- **migrate-reset**: Reset the database and apply all migrations

### Data Management
- **Prisma-Studio**: Launch Prisma Studio to visually browse and edit your database

## Requirements

- Node.js 20.0.0 or higher
- Claude Desktop 0.10.0 or higher

## Installation

1. Download the latest `.dxt` file from the releases
2. Install in Claude Desktop through the Extensions menu
3. Start using Prisma tools directly in your conversations

## Local Development

To build this extension from source:

```bash
# Install dependencies
cd server
npm install

# Pack the extension
npx @anthropic-ai/dxt pack
```

This generates a `mcp.dxt` file containing the complete extension bundle.

This is a zip file containing the entire project in `server`, including the `node_modules` folder

## Using the GitHub Actions Release Workflow

This project includes an automated release workflow that can be triggered manually:

1. Go to the "Actions" tab in the GitHub repository
2. Select "Build and Publish DXT (latest)" workflow
3. Click "Run workflow"
4. Fill in the input fields:
   - **Version bump**: Choose between `patch`, `minor`, or `major` version increments
   - **Release notes**: Add custom notes to be included in the release (optional)
   - **Mark as pre-release**: Check this option to mark the release as a pre-release
5. Click "Run workflow" to start the build and release process

The workflow will:

- Build the DXT package
- Generate a semantic version based on your selection
- Create a GitHub release with the DXT file
- Include commit history and your custom notes in the release

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- [GitHub Issues](https://github.com/prisma/mcp/issues)
- [Prisma Documentation](https://www.prisma.io/docs)
