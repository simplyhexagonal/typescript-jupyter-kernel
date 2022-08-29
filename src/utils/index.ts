
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { createHmac } from 'crypto';
import { Socket } from 'zeromq';
import ShortUniqueId from 'short-unique-id';

import { KernealHeader } from '../interfaces.js';

export const uid = new ShortUniqueId.default();

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

export const jupyterPolyfill = [
  ['PATH_KERNEL_DIR', resolve(__dirname)],
  ['SCRIPT_PATH_ESCAPE_UNICODE', resolve(__dirname, 'src/vendor/escape-unicode-html.mjs')],
  ['SCRIPT_PATH_D3_DSV', resolve(__dirname, 'src/vendor/d3-dsv/index.mjs')],
  ['SCRIPT_PATH_D3_SELECTION', resolve(__dirname, 'src/vendor/d3-selection/index.mjs')],
].reduce(
  (a, [key, value]) => {
    return a.replace(key, value);
  },
  readFileSync(resolve(__dirname, 'src/utils/polyfill.ts'), 'utf8'),
);
