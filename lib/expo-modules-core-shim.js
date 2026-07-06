// Partial shim for expo-modules-core on web/SSR.
// Provides just enough surface area so that expo-router's splash and
// other expo packages that import expo-modules-core do not crash.

function requireOptionalNativeModule(_moduleName) {
  return null;
}

function requireNativeModule(_moduleName) {
  return {};
}

const NativeModulesProxy = {};
const GlobalModuleProxy = {};

class EventEmitter {
  addListener() { return { remove: () => {} }; }
  removeAllListeners() {}
  emit() {}
}

class SharedObject {
  release() {}
}

class NativeModule extends EventEmitter {}

function createPermissionHook() {
  return function usePermissions() {
    return [{ status: 'undetermined' }, async () => ({ status: 'undetermined' })];
  };
}

// registerWebModule is called by expo-font and other expo packages on web
// to register native module implementations. Return a no-op class/object.
function registerWebModule(moduleClass) {
  // Return the class itself so callers that do `new (registerWebModule(Cls))()`
  // still get a valid instance.
  if (typeof moduleClass === 'function') return moduleClass;
  return function() {};
}

// Some packages call NativeModule as a base class factory
function createNativeModule(moduleName, definition) {
  return definition || {};
}

module.exports = {
  requireOptionalNativeModule,
  requireNativeModule,
  NativeModulesProxy,
  GlobalModuleProxy,
  EventEmitter,
  SharedObject,
  NativeModule,
  createPermissionHook,
  registerWebModule,
  createNativeModule,
  // uuid helper sometimes imported
  uuidv4: () => Math.random().toString(36).slice(2),
  // Platform constants shim
  Platform: { OS: 'web' },
};
