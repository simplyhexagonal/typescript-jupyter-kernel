import { resolve } from 'path';
import {
  writeFileSync,
  rmSync,
} from 'fs';
import MonoContext from '@simplyhexagonal/mono-context';
import exec from '@simplyhexagonal/exec';
import { Socket } from 'zeromq';

import {
  send,
  makeHeader,
  instanceUid,
  jupyterPolyfill,
} from '../../utils';

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
  const logger = MonoContext.getStateValue('logger');

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

  const tempTsFile = resolve(process.cwd(), `._${instanceUid}-${executionCount}.ts`);

  writeFileSync(
    tempTsFile,
    `${jupyterPolyfill}${reqContent.code}`,
  );

  const { exitCode, stdoutOutput, stderrOutput } = await exec(
    `${resolve(__dirname, '..', 'node_modules', '.bin', 'ts-node')} --swc ${tempTsFile}`,
  ).catch(
    async (e) => {
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

  const metadata = {
    dependencies_met: true,
    engine: instanceUid,
    status: 'ok',
    started: new Date().toISOString(),
  };
}
