import { Socket } from 'zeromq';

import {
  send,
  makeHeader,
} from '../../utils/index.js';

// @ts-ignore
import pkgJson from '../../../package.json' assert { type: 'json' };

const { version: implementation_version } = pkgJson;

export default (
  {
    shellSocket,
    ioSocket,
    key,
    session,
    version,
    rawHeader,
    zmqIdentities,
    delimiter,
  }: {
    shellSocket: Socket,
    ioSocket: Socket,
    key: string,
    session: string,
    version: string,
    rawHeader: Buffer,
    zmqIdentities: Buffer,
    delimiter: Buffer,
  }
) => {
  const content = {
    status: 'ok',
    protocol_version: '5.0',
    implementation: 'typescript',
    implementation_version,
    language_info: {
      name: 'typescript',
      version: '4.8.2',
      mimetype: 'text/x-typescript',
      file_extension: '.ts',
      pygments_lexer: 'ts',
      codemirror_mode: 'ts',
      nbconvert_exporter: '',
    },
    banner: '',
    debugger: false,
  };

  send(
    shellSocket,
    {
      key: key,
      header: makeHeader(
        'kernel_info_reply',
        session,
        version,
      ),
      parentHeader: rawHeader,
      content,
      zmqIdentities,
      delimiter,
    }
  );

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
      content: {
        execution_state: 'idle',
      },
      zmqIdentities,
      delimiter,
    }
  );
}
