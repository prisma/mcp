const { spawn } = require('child_process');
const fs = require('fs');

// dxt pack doesn't maintain the execute bit
fs.chmod(process.env.CLI_PATH, 0o755, (err) => {
  if (err) {
    console.error("Failed to chmod:", err);
  }
});

// Prisma MCP server is only exposed as a CLI command, so spawn it
const child = spawn(process.env.CLI_PATH, ['mcp'], {
  stdio: 'inherit'
});