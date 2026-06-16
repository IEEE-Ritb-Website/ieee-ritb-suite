---
name: mcp-builder
description: Assist in designing, building, and configuring custom Model Context Protocol (MCP) servers in TypeScript and Node.js. Use this skill when the user wants to add new tool integrations, build an MCP server from scratch, modify existing MCP servers, or configure local/remote MCP servers.
---

# MCP Builder

A skill to guide the creation, development, and configuration of custom Model Context Protocol (MCP) servers in TypeScript/Node.js.

## What is MCP?

The Model Context Protocol (MCP) is an open standard that allows AI assistants to securely interact with local or remote resources, data, and tools. MCP servers can expose:

1. **Tools**: Executable functions (e.g., compile code, search a database, call an API).
2. **Resources**: Static or dynamic data sources (e.g., log files, database schemas).
3. **Prompts**: Pre-configured templates or system instructions.

## Step-by-Step Guide to Creating an MCP Server

### 1. Initialize Project

Initialize a new TypeScript project for the MCP server:

```bash
mkdir my-mcp-server
cd my-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk
npm install --save-dev typescript @types/node ts-node
npx tsc --init
```

### 2. Implementation Template (TypeScript)

Create `src/index.ts` with the following standard SDK template:

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Initialize the MCP server
const server = new Server(
  {
    name: "my-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "greet_user",
        description: "Greets the user by name",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "The name of the user to greet",
            },
          },
          required: ["name"],
        },
      },
    ],
  };
});

// Handle tool execution requests
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "greet_user") {
    const userName = String(args?.name || "Guest");
    return {
      content: [
        {
          type: "text",
          text: `Hello, ${userName}! Welcome to the custom MCP server.`,
        },
      ],
    };
  }

  throw new Error(`Tool not found: ${name}`);
});

// Start the server using Stdio transport
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP server running on stdio");
}

run().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
```

### 3. Build & Configuration

Ensure your `tsconfig.json` compiles the files correctly to JavaScript:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"]
}
```

Add a build script to `package.json`:

```json
"scripts": {
  "build": "tsc",
  "start": "node dist/index.js"
}
```

### 4. Register the MCP Server

To register the MCP server locally in OpenCode, add it to `.opencode/opencode.json` under `"mcpServers"`:

```json
"mcpServers": {
  "my-mcp-server": {
    "command": "node",
    "args": ["/path/to/my-mcp-server/dist/index.js"],
    "env": {
      "NODE_ENV": "development"
    }
  }
}
```
