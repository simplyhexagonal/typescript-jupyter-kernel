/// <reference types="node" />
import { Socket } from 'zeromq';
declare const _default: ({ shellSocket, key, session, version, rawHeader, content: reqContent, zmqIdentities, delimiter, }: {
    shellSocket: Socket;
    ioSocket: Socket;
    key: string;
    session: string;
    version: string;
    rawHeader: Buffer;
    content: any;
    zmqIdentities: Buffer;
    delimiter: Buffer;
}) => Promise<void>;
export default _default;
