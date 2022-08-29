import { Socket } from 'zeromq';

import {
  send,
  makeHeader,
} from '../../utils/index.js';

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
  send(
    shellSocket,
    {
      key: key,
      header: makeHeader(
        'history_reply',
        session,
        version,
      ),
      parentHeader: rawHeader,
      content: {
        status: 'ok',
        history: [],
      },
      zmqIdentities,
      delimiter,
    }
  );
}
