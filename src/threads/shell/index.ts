import MonoContext from '@simplyhexagonal/mono-context';

import { KernelConfig } from '../../interfaces';

import kernelInfoReply from './kernelInfoReply';
import executeReply from './executeReply';

const reqResMap: {[k: string]: (a: any) => void} = {
  'kernel_info_request': kernelInfoReply,
  'execute_request': executeReply,
};

export default ({ip, shell_port, iopub_port, key}: KernelConfig) => {
  const zmq = require('zeromq');

  const logger = MonoContext.getStateValue('logger');

  logger.info('Shell thread started');

  const shellSocket = zmq.socket('router');
  const ioSocket = zmq.socket('pub');

  shellSocket.bindSync(`tcp://${ip}:${shell_port}`);
  ioSocket.bindSync(`tcp://${ip}:${iopub_port}`);

  shellSocket.on('message', async (
    zmqIdentities: Buffer,
    delimiter: Buffer,
    hmacSignature: Buffer,
    rawHeader: Buffer,
    rawParentHeader: Buffer,
    rawMetadata: Buffer,
    rawContent: Buffer,
  ) => {
    const {
      msg_type: msgType,
      session,
      version,
    } = JSON.parse(rawHeader.toString('ascii'));
    // const parentHeader = JSON.parse(rawParentHeader.toString('ascii'));
    // const metadata = JSON.parse(rawMetadata.toString('ascii'));
    const content = JSON.parse(rawContent.toString('ascii'));

    // await logger.debug('Shell received:', [
    //   zmqIdentities,
    //   delimiter,
    //   hmacSignature,
    //   rawHeader,
    //   rawParentHeader,
    //   rawMetadata,
    //   rawContent,
    // ].map(x => x.toString()));

    reqResMap[msgType]({
      shellSocket,
      ioSocket,
      key,
      session,
      version,
      rawHeader,
      content,
      zmqIdentities,
      delimiter,
    });
  });
}
