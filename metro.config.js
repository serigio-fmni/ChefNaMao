// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Exclude Node.js-only modules from web bundles
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web') {
    // Block Node-only modules that break web bundling
    const NODE_ONLY_MODULES = ['dotenv', 'fs', 'path', 'os', 'crypto', 'child_process'];
    if (NODE_ONLY_MODULES.some(m => moduleName === m || moduleName.startsWith(m + '/'))) {
      return { type: 'empty' };
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
