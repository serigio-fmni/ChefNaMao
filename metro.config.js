// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Modules that are native-only and must be shimmed on web
const NODE_ONLY_MODULES = [
  'dotenv',
  'fs',
  'path',
  'os',
  'crypto',
  'child_process',
  'stream',
  'http',
  'https',
  'net',
  'tls',
  'zlib',
];

// Path to the expo-modules-core partial shim
const EXPO_MODULES_CORE_SHIM = path.resolve(__dirname, 'lib/expo-modules-core-shim.js');

// Path to the node-fetch shim (used by @supabase/node-fetch on web)
const NODE_FETCH_SHIM = path.resolve(__dirname, 'lib/node-fetch-shim.js');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web') {
    // Block Node-only modules with an empty shim
    if (NODE_ONLY_MODULES.some(m => moduleName === m || moduleName.startsWith(m + '/'))) {
      return { type: 'empty' };
    }

    // Replace @supabase/node-fetch with a thin wrapper around the browser's
    // native fetch so that @supabase/postgrest-js does not crash on web.
    if (moduleName === '@supabase/node-fetch' || moduleName.startsWith('@supabase/node-fetch/')) {
      return {
        type: 'sourceFile',
        filePath: NODE_FETCH_SHIM,
      };
    }

    // Replace expo-modules-core with a partial shim that keeps
    // requireOptionalNativeModule and other surface-level APIs alive,
    // preventing crashes in expo-router/splash and similar packages.
    if (moduleName === 'expo-modules-core' || moduleName.startsWith('expo-modules-core/')) {
      return {
        type: 'sourceFile',
        filePath: EXPO_MODULES_CORE_SHIM,
      };
    }
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
