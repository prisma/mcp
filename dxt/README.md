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