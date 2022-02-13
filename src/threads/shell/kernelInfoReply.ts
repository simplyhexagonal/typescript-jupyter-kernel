import { Socket } from 'zeromq';
import {
  send,
  makeHeader,
} from '../../utils';

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
    implementation_version: '1.0.0',
    language_info: {
      name: 'typescript',
      version: '1.0',
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
