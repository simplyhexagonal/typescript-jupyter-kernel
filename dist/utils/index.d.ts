/// <reference types="node" />
import { Socket } from 'zeromq';
import ShortUniqueId from 'short-unique-id';
import { KernealHeader } from '../interfaces';
export declare const uid: ShortUniqueId;
export declare const instanceUid: any;
export declare const hexStamp: string;
export declare const msgUid: () => string;
export declare const send: (socket: Socket, { key, header, parentHeader, metadata, content, zmqIdentities, delimiter, }: {
    key: string;
    header: KernealHeader;
    metadata?: any;
    content: any;
    parentHeader: Buffer;
    zmqIdentities: Buffer;
    delimiter: Buffer;
}) => void;
export declare const makeHeader: (msg_type: string, session: string, version: string) => KernealHeader;
