## Local Development

First, install Prisma:

```
cd server
npm install
```

Then to pack a new version of the extension, in the root run

```
npx @anthropic-ai/dxt pack
```

This should generate a `mcp-dxt.dxt` file.

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
