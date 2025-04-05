const { spawn } = require('child_process');
const os = require('os');

const isWindows = os.platform() === 'win32';
const buildScript = isWindows ? 'build' : 'build:unix';

spawn('npm', ['run', buildScript], { stdio: 'inherit', shell: true });
