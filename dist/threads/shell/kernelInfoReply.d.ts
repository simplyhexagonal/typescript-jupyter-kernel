/// <reference types="node" />
import { Socket } from 'zeromq';
declare const _default: ({ shellSocket, ioSocket, key, session, version, rawHeader, zmqIdentities, delimiter, }: {
    shellSocket: Socket;
    ioSocket: Socket;
    key: string;
    session: string;
    version: string;
    rawHeader: Buffer;
    zmqIdentities: Buffer;
    delimiter: Buffer;
}) => void;
export default _default;
