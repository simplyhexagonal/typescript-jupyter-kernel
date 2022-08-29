import zmq from 'zeromq';

import { KernelConfig } from '../../interfaces.js';

export default (jupyterConfig: KernelConfig) => {
  logger.info('Heartbeat thread started');

  const heartbeatSocket = zmq.socket('rep');

  heartbeatSocket.bindSync(`tcp://${jupyterConfig.ip}:${jupyterConfig.hb_port}`);

  heartbeatSocket.on('message', async (msg) => {
    heartbeatSocket.send(msg);
  });
}
