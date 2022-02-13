require('dotenv').config();

import MonoContext from '@simplyhexagonal/mono-context';
import Logger from '@simplyhexagonal/logger';

import cli from './cli';
import main from './threads/main';
import heartbeat from './threads/heartbeat';
import control from './threads/control';
import shell from './threads/shell';
import { KernelConfig } from './interfaces';

const logger = new Logger({});

MonoContext.setState({
  logger,
});

const run = async () => {
  await cli();

  const jupyterConfigPath = process.argv[2] || process.env.JUPYTER_CONFIG_PATH || '';
  const jupyterConfig = require(jupyterConfigPath) as KernelConfig;

  const threadName = process.env.TS_KERNEL_THREAD || '';

  if (!['heartbeat', 'control', 'shell'].includes(threadName)) {
    return main(jupyterConfigPath, jupyterConfig);
  }

  switch (threadName) {
    case 'heartbeat':
      heartbeat(jupyterConfig);
      break;
    case 'control':
      control(jupyterConfig);
      break;
    case 'shell':
      shell(jupyterConfig);
      break;
  }
}

run();
