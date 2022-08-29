(await import('dotenv')).config();

//@ts-ignore
await import('../global.mjs');

import cli from './cli/index.js';
import main from './threads/main/index.js';
import heartbeat from './threads/heartbeat/index.js';
import { KernelConfig } from './interfaces.js';

(async () => {
  await cli();

  const jupyterConfigPath = process.argv[2] || process.env.JUPYTER_CONFIG_PATH || '';
  const jupyterConfig = (await import(jupyterConfigPath, { assert: { type: 'json' } })).default as KernelConfig;

  const threadName = process.env.TS_KERNEL_THREAD || '';

  if (!['heartbeat', 'control', 'shell'].includes(threadName)) {
    return main(jupyterConfigPath, jupyterConfig);
  }

  switch (threadName) {
    case 'heartbeat':
      heartbeat(jupyterConfig);
      break;
    case 'shell':
      (await import('./threads/shell/index.js')).default(jupyterConfig);
      break;
  }
})();
