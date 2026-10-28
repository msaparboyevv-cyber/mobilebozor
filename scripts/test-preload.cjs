// tsx asks for the current username to derive its temporary IPC socket path.
// This hosted Windows environment does not implement libuv's userInfo lookup.
const os = require('node:os');
const { syncBuiltinESMExports } = require('node:module');
os.userInfo = () => ({ username: process.env.USERNAME || 'mobilebozor-test' });
syncBuiltinESMExports();
