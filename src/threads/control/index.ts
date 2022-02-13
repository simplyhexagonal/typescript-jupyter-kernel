import MonoContext from '@simplyhexagonal/mono-context';

import { KernelConfig } from '../../interfaces';

export default (jupyterConfig: KernelConfig) => {
  const zmq = require('zeromq');

  const logger = MonoContext.getStateValue('logger');

  logger.info('Control thread started');

  const controlSocket = zmq.socket('router');

  controlSocket.bindSync(`tcp://${jupyterConfig.ip}:${jupyterConfig.control_port}`);
}
