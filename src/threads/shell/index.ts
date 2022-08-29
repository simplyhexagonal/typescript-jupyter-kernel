import { resolve } from 'path';
import fsExtra from 'fs-extra';
import MonoContext from '@simplyhexagonal/mono-context';
import { TspClient } from 'typescript-language-server/lib/tsp-client.js';
import { ConsoleLogger } from 'typescript-language-server/lib/logger.js';
import {
  TypeScriptVersion,
  TypeScriptVersionProvider,
} from 'typescript-language-server/lib/utils/versionProvider.js';
import API from 'typescript-language-server/lib/utils/api.js';

import { KernelConfig } from '../../interfaces.js';

import {
  instanceUid,
  jupyterPolyfill,
} from '../../utils/index.js';

import kernelInfoReply from './kernelInfoReply.js';
import executeReply from './executeReply.js';
import completeReply from './completeReply.js';
import historyReply from './historyReply.js';

const {
  rmSync,
  existsSync,
  mkdirpSync,
  writeFileSync,
} = fsExtra;

const reqResMap: {[k: string]: (a: any) => void} = {
  'kernel_info_request': kernelInfoReply,
  'execute_request': executeReply,
  'complete_request': completeReply,
  'history_request': historyReply,
};

export default async ({ip, shell_port, iopub_port, key}: KernelConfig) => {
  const zmq = await import('zeromq');

  const typescriptVersionProvider = new TypeScriptVersionProvider();
  const tspBundle = typescriptVersionProvider.bundledVersion() as TypeScriptVersion;

  const tspServer = new TspClient({
      apiVersion: tspBundle.version as API,
      logger: new ConsoleLogger(),
      // logVerbosity: 'verbose',
      tsserverPath: tspBundle!.tsServerPath,
      disableAutomaticTypingAcquisition: true,
  });

  tspServer.start();

  const tempTsDir = resolve(process.cwd(), '.ts-kernel');

  if (existsSync(tempTsDir)) {
    rmSync(tempTsDir, { recursive: true, force: true });
  }

  mkdirpSync(`${tempTsDir}/${instanceUid}`);

  const polyfillTsFile = resolve(process.cwd(), `.ts-kernel/${instanceUid}/_polyfill.ts`);

  writeFileSync(
    polyfillTsFile,
    `${jupyterPolyfill}`,
  );

  MonoContext.default.setState({
    tspServer,
  });

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
