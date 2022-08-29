import Logger from '@simplyhexagonal/logger';

declare global {
  const logger: Logger;
  const __filename: string;
  const __dirname: string;
}

export {}
