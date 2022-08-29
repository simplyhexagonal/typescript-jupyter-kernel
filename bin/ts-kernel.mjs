#! /usr/bin/env node
import { spawn } from 'child_process';
import { resolve }  from 'path';

await import('../global.mjs');

const proc = spawn(
  resolve(__dirname, 'node_modules/.bin/ts-node-esm'),
  [
    '--files',
    resolve(__dirname, 'src/index.ts'),
    ...process.argv.slice(2),
  ]
);

proc.stdout.on('data', process.stdout.write.bind(process.stdout));

proc.stderr.on('data', process.stderr.write.bind(process.stderr));
