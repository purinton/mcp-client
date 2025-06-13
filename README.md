# [![Purinton Dev](https://purinton.us/logos/brand.png)](https://discord.gg/QSBxQnX7PF)

## @purinton/mcp-client [![npm version](https://img.shields.io/npm/v/@purinton/mcp-client.svg)](https://www.npmjs.com/package/@purinton/mcp-client)[![license](https://img.shields.io/github/license/purinton/mcp-client.svg)](LICENSE)[![build status](https://github.com/purinton/mcp-client/actions/workflows/nodejs.yml/badge.svg)](https://github.com/purinton/mcp-client/actions)

> A robust Node.js client for connecting to Model Context Protocol (MCP) servers with automatic reconnect, authentication, and flexible transport support.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [ESM Example](#esm-example)
  - [CommonJS Example](#commonjs-example)
- [API](#api)
- [TypeScript](#typescript)
- [License](#license)

## Features

- Connects to MCP servers with automatic reconnect
- Supports both ESM and CommonJS
- Customizable logger, transport, and client classes
- Reads configuration from environment variables or options
- TypeScript type definitions included

## Installation

```bash
npm install @purinton/mcp-client
```

## Usage

### ESM Example

```js
import mcpClient from '@purinton/mcp-client';

(async () => {
  try {
    const client = await mcpClient({
      // token: 'your-mcp-token',
      // baseUrl: 'http://localhost:1234/',
    });
    console.log('MCP Client connected:', !!client);
    // Use the client as needed...
  } catch (err) {
    console.error('Failed to connect MCP Client:', err);
  }
})();
```

### CommonJS Example

```js
const mcpClient = require('@purinton/mcp-client');

(async () => {
  try {
    const client = await mcpClient({
      // token: 'your-mcp-token',
      // baseUrl: 'http://localhost:1234/',
    });
    console.log('MCP Client connected:', !!client);
    // Use the client as needed...
  } catch (err) {
    console.error('Failed to connect MCP Client:', err);
  }
})();
```

## API

### mcpClient(options?: McpClientOptions): Promise<any>

Creates and connects an MCP client. Returns a connected client instance. Automatically reconnects on disconnect.

#### Options (McpClientOptions):
- `logger` (optional): Custom logger (default: @purinton/log)
- `port` (optional): MCP server port (default: 1234)
- `baseUrl` (optional): MCP server URL (default: http://localhost:1234/)
- `token` (optional): Authentication token (default: from MCP_TOKEN env)
- `ClientClass` (optional): Custom client class (default: SDK Client)
- `TransportClass` (optional): Custom transport class (default: SDK StreamableHTTPClientTransport)

## TypeScript

Type definitions are included:

```ts
import mcpClient, { McpClientOptions } from '@purinton/mcp-client';

const client = await mcpClient({
  token: 'your-mcp-token',
  baseUrl: 'http://localhost:1234/',
} as McpClientOptions);
```

## Support

For help, questions, or to chat with the author and community, visit:

[![Discord](https://purinton.us/logos/discord_96.png)](https://discord.gg/QSBxQnX7PF)[![Purinton Dev](https://purinton.us/logos/purinton_96.png)](https://discord.gg/QSBxQnX7PF)

**[Purinton Dev on Discord](https://discord.gg/QSBxQnX7PF)**

## License

[MIT © 2025 Russell Purinton](LICENSE)

## Links

- [GitHub](https://github.com/purinton/mcp-client)
- [npm](https://www.npmjs.com/package/@purinton/mcp-client)
- [Discord](https://discord.gg/QSBxQnX7PF)
