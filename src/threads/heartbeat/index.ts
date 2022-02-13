import MonoContext from '@simplyhexagonal/mono-context';
import zmq from 'zeromq';

import { KernelConfig } from '../../interfaces';

export default (jupyterConfig: KernelConfig) => {
  const logger = MonoContext.getStateValue('logger');

  logger.info('Heartbeat thread started');

  const heartbeatSocket = zmq.socket('rep');

  heartbeatSocket.bindSync(`tcp://${jupyterConfig.ip}:${jupyterConfig.hb_port}`);

  heartbeatSocket.on('message', async (msg) => {
    heartbeatSocket.send(msg);
  });
}
