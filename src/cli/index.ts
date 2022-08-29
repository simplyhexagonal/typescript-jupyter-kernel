import { resolve } from 'path';
import fsExtra from 'fs-extra';

const {
  statSync,
  mkdirpSync,
  writeFileSync,
  readFileSync,
  copyFileSync,
} = fsExtra;

export default async () => {
  if (process.argv[2] === '--version' || process.argv[2] === '-v' || process.argv[2] === '') {
    console.log(
      (
        await import(
          resolve(__dirname, 'package.json'),  { assert: { type: 'json' } }
        )
      ).default.version,
    );

    process.exit(0);
  }

  if (process.argv[2] === 'install') {
    const possiblePaths = [
      `${process.env.HOME}/.local/share/jupyter/kernels`, // Linux
      `${process.env.HOME}/Library/Jupyter/kernels`, // Mac
      `${process.env.APPDATA}/jupyter/kernels`, // Windows
    ];

    let kernelsPath = '';

    let kernelJsonPath = resolve(__dirname, 'kernel.json');

    if (process.argv[3]) {
      kernelJsonPath = resolve(process.argv[3]);
    }

    logger.info(
      'Looking for kernels directory in:\n\n\t',
      possiblePaths.map((p) => p.replace('undefined', '%APPDATA%')).join('\n\t ')
    );

    try {
      kernelsPath = possiblePaths.find((path) => statSync(path).isDirectory()) as string;
    } catch (e) {
      await logger.error('Could not find kernels path!');

      process.exit(10);
    }

    const installFilePath = `${kernelsPath}/typescript/kernel.json`;

    await logger.info('Found kernels path:', kernelsPath, '\n\nInstalling Typescript kernel to:', installFilePath);

    try {
      mkdirpSync(`${kernelsPath}/typescript`);

      const config = readFileSync(kernelJsonPath);

      logger.info(config.toString());

      writeFileSync(
        installFilePath,
        config
      );
    } catch (e) {
      await logger.error('Could not install kernel!', e);

      process.exit(15);
    }

    try {
      const logo32Path = resolve(__dirname, 'logo-32x32.png');
      const logo64Path = resolve(__dirname, 'logo-64x64.png');

      statSync(logo32Path).isFile() && copyFileSync(logo32Path, `${kernelsPath}/typescript/logo-32x32.png`);
      statSync(logo64Path).isFile() && copyFileSync(logo64Path, `${kernelsPath}/typescript/logo-64x64.png`);
    } catch(e) {
      await logger.warn('Could not copy logo files!', e);
    }

    await logger.info('Installed kernel successfully!');

    process.exit(0);
  }
}