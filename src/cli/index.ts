import { resolve } from 'path';
import {
  statSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
} from 'fs';
import MonoContext from '@simplyhexagonal/mono-context';

export default async () => {
  const logger = MonoContext.getStateValue('logger');

  if (process.argv[2] === '--version') {
    console.log(require(resolve(__dirname, '../package.json')).version);

    process.exit(0);
  }

  if (process.argv[2] === 'install') {
    const possiblePaths = [
      `${process.env.HOME}/.local/share/jupyter/kernels`, // Linux
      `${process.env.HOME}/Library/Jupyter/kernels`, // Mac
      `${process.env.APPDATA}/jupyter/kernels`, // Windows
    ];

    let kernelsPath = '';

    logger.info(
      'Looking for kernels directory in:\n\n\t',
      possiblePaths.map((p) => p.replace('undefined', '%APPDATA%')).join('\n\t ')
    );

    try {
      kernelsPath = possiblePaths.find(path => statSync(path).isDirectory()) as string;
    } catch (e) {
      await logger.error('Could not find kernels path!');

      process.exit(10);
    }

    const installFilePath = `${kernelsPath}/typescript/kernel.json`;

    await logger.info('Found kernels path:', kernelsPath, '\n\nInstalling Typescript kernel to:', installFilePath);

    try {
      mkdirSync(`${kernelsPath}/typescript`, { recursive: true });

      writeFileSync(
        installFilePath,
        readFileSync(resolve(__dirname, '../kernel.json'))
      );
    } catch (e) {
      await logger.error('Could not install kernel!', e);

      process.exit(15);
    }

    await logger.info('Installed kernel successfully!');

    process.exit(0);
  }
}