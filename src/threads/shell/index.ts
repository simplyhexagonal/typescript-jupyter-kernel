import MonoContext from '@simplyhexagonal/mono-context';
import { TspClient } from 'typescript-language-server/lib/tsp-client';
import { ConsoleLogger } from 'typescript-language-server/lib/logger';
import { TypeScriptVersionProvider } from 'typescript-language-server/lib/utils/versionProvider';

import { KernelConfig } from '../../interfaces';

import kernelInfoReply from './kernelInfoReply';
import executeReply from './executeReply';
import completeReply from './completeReply';
import historyReply from './historyReply';

const reqResMap: {[k: string]: (a: any) => void} = {
  'kernel_info_request': kernelInfoReply,
  'execute_request': executeReply,
  'complete_request': completeReply,
  'history_request': historyReply,
};

export default ({ip, shell_port, iopub_port, key}: KernelConfig) => {
  const zmq = require('zeromq');

  const typescriptVersionProvider = new TypeScriptVersionProvider();
  const tspBundle = typescriptVersionProvider.bundledVersion();

  const tspServer = new TspClient({
      logger: new ConsoleLogger(),
      // logVerbosity: 'verbose',
      tsserverPath: tspBundle!.tsServerPath,
      disableAutomaticTypingAcquisition: true,
  });

  tspServer.start();

  MonoContext.setState({
    tspServer,
  });

  const logger = MonoContext.getStateValue('logger');

  logger.info('Shell thread started');

  const shellSocket = zmq.socket('router');
  const ioSocket = zmq.socket('pub');

  shellSocket.bindSync(`tcp://${ip}:${shell_port}`);
  ioSocket.bindSync(`tcp://${ip}:${iopub_port}`);

  ioSocket.on('message', async (
    zmqIdentities: Buffer,
    delimiter: Buffer,
    hmacSignature: Buffer,
    rawHeader: Buffer,
    rawParentHeader: Buffer,
    rawMetadata: Buffer,
    rawContent: Buffer,
  ) => {
    await logger.debug('IO received:', [
      zmqIdentities,
      delimiter,
      hmacSignature,
      rawHeader,
      rawParentHeader,
      rawMetadata,
      rawContent,
    ].map(x => x.toString()));
  });

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

    await logger.debug('Shell received:', [
      zmqIdentities,
      delimiter,
      hmacSignature,
      rawHeader,
      rawParentHeader,
      rawMetadata,
      rawContent,
    ].map(x => x.toString()));

    if (reqResMap[msgType]) {
      try {
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
      } catch (e) {
        logger.error(`Shell error (msgType > ${msgType}):`, e);
      }
    } else {
      logger.warn(`Shell received unknown message type: ${msgType}`);
    }
  });
}
