/* eslint-disable @typescript-eslint/no-var-requires */
const dotEnv = require('dotenv');
const path = require('path');

dotEnv.config({ path: path.resolve(__dirname, '.env.jest') });
