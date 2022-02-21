import MonoContext from '@simplyhexagonal/mono-context';
import { Socket } from 'zeromq';

import {
  send,
  makeHeader,
} from '../../utils';

export default async (
  {
    shellSocket,
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
  const {
    logger,
    tspServer,
  } = MonoContext.getState();

  const { code, cursor_pos: cursor_end } = reqContent;

  const prefix = (code as string).substring(0, cursor_end).split(/\s|;/g).pop() || '';

  try {
    tspServer.notify(
      'open',
      {
        file: 'typescript',
        fileContent: '',
      },
    );

    const completions = await tspServer.request(
      'completionInfo',
      {
        file: 'typescript',
        line: 1,
        offset: 0,
        prefix,
      },
    );

    const content = {
      status: 'ok',
      matches: ((completions.body || {}).entries || []).map((entry: any) => entry.name),
      cursor_start: cursor_end - prefix.length,
      cursor_end,
      metadata: {},
    };

    logger.debug(content);

    send(
      shellSocket,
      {
        key: key,
        header: makeHeader(
          'complete_reply',
          session,
          version,
        ),
        parentHeader: rawHeader,
        content,
        zmqIdentities,
        delimiter,
      }
    );
  } catch (e) {
    console.log(e);
  }
}
