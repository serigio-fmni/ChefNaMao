// Shim for @supabase/node-fetch on web.
// The browser already has a native fetch; re-export it so that
// @supabase/postgrest-js and other Supabase packages work without
// pulling in the Node-specific node-fetch implementation.

const _fetch = typeof fetch !== 'undefined' ? fetch : () => Promise.reject(new Error('fetch not available'));
const _Headers = typeof Headers !== 'undefined' ? Headers : class Headers {};
const _Request = typeof Request !== 'undefined' ? Request : class Request {};
const _Response = typeof Response !== 'undefined' ? Response : class Response {};

module.exports = _fetch;
module.exports.default = _fetch;
module.exports.fetch = _fetch;
module.exports.Headers = _Headers;
module.exports.Request = _Request;
module.exports.Response = _Response;
