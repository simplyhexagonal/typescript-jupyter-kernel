import { fileURLToPath } from 'url';
import Logger from '@simplyhexagonal/logger';

const logger = new Logger({});

global.__filename = fileURLToPath(import.meta.url);
global.__dirname = fileURLToPath(new URL('.', import.meta.url));

global.logger = logger;
