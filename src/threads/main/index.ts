import { resolve as resolvePath } from 'path';
import { fork } from 'child_process';
import MonoContext from '@simplyhexagonal/mono-context';

import { KernelConfig } from '../../interfaces';

const startThread = (
  threadName: string,
  jupyterConfigPath: string,
  reject: (e?: any) => void
) => {
  const logger = MonoContext.getStateValue('logger');

  const tsKernelPath = resolvePath(__dirname, '..', '..', '..', 'bin', 'ts-kernel');

  const thread = fork(
    tsKernelPath,
    {
      env: {
        ...process.env,
        NODE_OPTIONS: (threadName === 'shell') ? '' : '--max-old-space-size=256',
        TS_KERNEL_THREAD: threadName,
        JUPYTER_CONFIG_PATH: jupyterConfigPath,
      },
    },
  );

  thread.on('error', (e) => {
    logger.error('Heartbeat thread error:', e);

    reject(e);
  });

  thread.on('exit', (code) => {
    if (code !== 0) {
      const errorMessage = `Thread stopped with exit code ${code}`;

      logger.error(errorMessage);

      reject(new Error(errorMessage));
    }
  });
};

export default async (
  jupyterConfigPath: string,
  jupyterConfig: KernelConfig,
) => {
  const logger = MonoContext.getStateValue('logger');

  await logger.info('Starting Typescript kernel with config:', jupyterConfig);

  return new Promise<void>(({}, reject) => {
    startThread('heartbeat', jupyterConfigPath, reject);
    startThread('control', jupyterConfigPath, reject);
    startThread('shell', jupyterConfigPath, reject);
  });
}
