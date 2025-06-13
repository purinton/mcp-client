const fs = require('fs');
const log = require('@purinton/log');
const pathUtil = require('@purinton/path');
const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StreamableHTTPClientTransport } = require('@modelcontextprotocol/sdk/client/streamableHttp.js');

async function mcpClient({
  logger = log,
  port = process.env.MCP_PORT || 1234,
  baseUrl = process.env.MCP_URL || `http://localhost:${port}/`,
  token,
  ClientClass = Client,
  TransportClass = StreamableHTTPClientTransport,
} = {}) {
  let client;
  let transport;
  let RECONNECT_BASE_DELAY = process.env.MCP_RECONNECT_BASE_DELAY ? parseInt(process.env.MCP_RECONNECT_BASE_DELAY, 10) : 1000; // 1s
  if (isNaN(RECONNECT_BASE_DELAY) || RECONNECT_BASE_DELAY < 1000) {
    RECONNECT_BASE_DELAY = 1000;
  }
  const RECONNECT_MAX_DELAY = process.env.MCP_RECONNECT_MAX_DELAY ? parseInt(process.env.MCP_RECONNECT_MAX_DELAY, 10) : 60000; // 1min
  if (isNaN(RECONNECT_MAX_DELAY) || RECONNECT_MAX_DELAY < RECONNECT_BASE_DELAY) {
    RECONNECT_MAX_DELAY = RECONNECT_BASE_DELAY;
  }
  let reconnectDelay = RECONNECT_BASE_DELAY;

  // Get version from package.json
  let version = '1.0.0';
  try {
    // __dirname is available in CommonJS
    const packageJsonPath = pathUtil(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    version = packageJson.version || version;
  } catch (err) {
    logger.warn && logger.warn('[CLIENT] Could not read package.json for version:', err && err.stack ? err.stack : err);
  }

  async function connectWithRetry() {
    // Fallback to env only if token is undefined or null
    let authToken = token;
    if (authToken === undefined || authToken === null) {
      authToken = process.env.MCP_TOKEN;
    }
    if (!authToken) {
      logger.error && logger.error('No MCP_TOKEN provided for MCP client authentication.');
      throw new Error('Missing MCP_TOKEN for MCP client authentication.');
    }
    try {
      client = new ClientClass(
        { name: '@purinton/mcp-client', version },
        { capabilities: { sampling: {} } }
      );
      const transportOptions = {
        requestInit: {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      };
      logger.debug && logger.debug(`[DEBUG] Using MCP_TOKEN for Authorization header`);
      transport = new TransportClass(baseUrl, transportOptions);
      await client.connect(transport);
      logger.debug && logger.debug(`MCP Client connected to ${baseUrl}`);
      reconnectDelay = RECONNECT_BASE_DELAY;
      if (typeof transport.on === 'function') {
        transport.on('close', handleDisconnect);
        transport.on('error', handleDisconnect);
      }
      return client;
    } catch (error) {
      logger.error && logger.error('Error connecting MCP Client:', error);
      await new Promise(resolve => setTimeout(resolve, reconnectDelay));
      reconnectDelay = Math.min(reconnectDelay * 2, RECONNECT_MAX_DELAY);
      return connectWithRetry();
    }
  }

  function handleDisconnect() {
    logger.debug && logger.debug('MCP Client disconnected. Attempting to reconnect...');
    setTimeout(connectWithRetry, reconnectDelay);
    reconnectDelay = Math.min(reconnectDelay * 2, RECONNECT_MAX_DELAY);
  }

  return connectWithRetry();
}

module.exports = mcpClient;
