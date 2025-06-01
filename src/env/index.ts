import { config as dotEnvConfig } from 'dotenv-safe';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ROOT_DIR = path.resolve(__dirname, '../..');

const ENV_PATH = path.join(ROOT_DIR, '.env');

dotEnvConfig({
  path: ENV_PATH,
  allowEmptyValues: true
});

export const PORT = process.env.PORT;
export const APP_NAME = process.env.APP_NAME;
