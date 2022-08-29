import { resolve as resolvePath } from 'path';
import { fork } from 'child_process';

import { KernelConfig } from '../../interfaces.js';

const startThread = (
  threadName: string,
  jupyterConfigPath: string,
  reject: (e?: any) => void
) => {
  const tsKernelPath = resolvePath(__dirname, 'src/index.ts');

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
  await logger.info('Starting Typescript kernel with config:', jupyterConfig);

  return new Promise<void>(({}, reject) => {
    startThread('heartbeat', jupyterConfigPath, reject);
    startThread('control', jupyterConfigPath, reject);
    startThread('shell', jupyterConfigPath, reject);
  });
}
