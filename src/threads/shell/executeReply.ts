import { resolve } from 'path';
import fsExtra from 'fs-extra';
import exec from '@simplyhexagonal/exec';
import { Socket } from 'zeromq';

import {
  send,
  makeHeader,
  instanceUid,
  jupyterPolyfill,
} from '../../utils/index.js';

const {
  rmSync,
  existsSync,
  writeFileSync,
} = fsExtra;

let executionCount = 0;

export default async (
  {
    shellSocket,
    ioSocket,
    key,
    session,
    version,
    rawHeader,
    content: reqContent,
    zmqIdentities,
    delimiter,
  }: {
    shellSocket: Socket,
    ioSocket: Socket,
    key: string,
    session: string,
    version: string,
    rawHeader: Buffer,
    content: any,
    zmqIdentities: Buffer,
    delimiter: Buffer,
  }
) => {
  executionCount += 1;

  let content: any = {
    execution_state: 'busy',
  };

  send(
    ioSocket,
    {
      key: key,
      header: makeHeader(
        'status',
        session,
        version,
      ),
      parentHeader: rawHeader,
      content,
      zmqIdentities,
      delimiter,
    }
  );

  content = {
    execution_count: executionCount,
    code: reqContent.code,
  };

  send(
    ioSocket,
    {
      key: key,
      header: makeHeader(
        'execute_input',
        session,
        version,
      ),
      parentHeader: rawHeader,
      content,
      zmqIdentities,
      delimiter,
    }
  );
  const consecutiveTsFile = resolve(process.cwd(), `.ts-kernel/${instanceUid}/${executionCount.toString(16).padStart(16, '0')}.ts`);

  writeFileSync(
    consecutiveTsFile,
    `${reqContent.code}`,
  );

  const tempTsFile = resolve(process.cwd(), `.ts-kernel/${instanceUid}/_run.ts`);
  const polyfillTsFile = resolve(process.cwd(), `.ts-kernel/${instanceUid}/_polyfill.ts`);

  writeFileSync(
    tempTsFile,
    `await import('${polyfillTsFile}'); await import ('${consecutiveTsFile}');`,
  );

  //@ts-ignore
  const { execPromise } = exec(
    `node --experimental-network-imports --loader ${resolve(__dirname, 'node_modules/ts-node/esm/transpile-only.mjs')} ${tempTsFile}`,
  );

  const { exitCode, stdoutOutput, stderrOutput } = await execPromise.catch(
    async (e: any) => {
      await logger.error(e);

      return e;
    }
  );

  rmSync(tempTsFile);

  content = {
    execution_count: executionCount,
    data: { 'text/html': exitCode ? `<div style="border: 1px solid red; padding: 20px; background: #ffaaaa;"><pre>${stderrOutput}</pre></div>` : stdoutOutput },
    metadata: {},
  };

  send(
    ioSocket,
    {
      key: key,
      header: makeHeader(
        'execute_result',
        session,
        version,
      ),
      parentHeader: rawHeader,
      content,
      zmqIdentities,
      delimiter,
    }
  );
  
  content = {
    execution_state: 'idle',
  };

  send(
    ioSocket,
    {
      key: key,
      header: makeHeader(
        'status',
        session,
        version,
      ),
      parentHeader: rawHeader,
      content,
      zmqIdentities,
      delimiter,
    }
  );
}
