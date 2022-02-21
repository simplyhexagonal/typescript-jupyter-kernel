
import { createHmac } from 'crypto';
import { Socket } from 'zeromq';
import ShortUniqueId from 'short-unique-id';

import { KernealHeader } from '../interfaces';

export const uid = new ShortUniqueId();

let msgConsecutive = 0;

export const instanceUid = uid(24);
export const hexStamp = Math.floor(+new Date() / 1e3).toString(16);

export const msgUid = () => {
  msgConsecutive += 1;

  return `${hexStamp}-${instanceUid}_${msgConsecutive}`;
};

export const send = (
  socket: Socket,
  {
    key,
    header,
    parentHeader,
    metadata = {},
    content,
    zmqIdentities,
    delimiter,
  }: {
    key: string;
    header: KernealHeader;
    metadata?: any;
    content: any;
    parentHeader: Buffer;
    zmqIdentities: Buffer;
    delimiter: Buffer;
  }
) => {
  const reply = [
    Buffer.from(JSON.stringify(header), 'ascii'),
    parentHeader,
    Buffer.from(JSON.stringify(metadata), 'ascii'),
    Buffer.from(JSON.stringify(content), 'ascii'),
  ];

  const replySignature = createHmac('sha256', key);

  reply.forEach(x => replySignature.update(x));

  reply.unshift(
    Buffer.from(replySignature.digest('hex'), 'ascii')
  );
  reply.unshift(delimiter);
  reply.unshift(zmqIdentities);

  socket.send(reply);
};

export const makeHeader = (
  msg_type: string,
  session: string,
  version: string,
): KernealHeader => ({
  msg_type,
  session,
  version,
  msg_id: msgUid(),
  username: 'kernel',
  date: new Date().toISOString(),
});

export const jupyterPolyfill = `
const jupyter: {
  out: (...args: any[]) => void
} = {};
jupyter.out = console.log;
`;
