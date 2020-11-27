import { LevelWithSilent } from 'pino';
import { Environment } from './api';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      LOG_LEVEL?: LevelWithSilent;
      RUNTIME_ENV?: Environment;
      GRACEFUL_SHUTDOWN?: string;
      ENFORCE_HTTPS?: string;
      ALLOWED_API_KEYS?: string;
    }
  }

  declare namespace Express {
    interface Request {
      /**
       * Returns the request id.
       * In case request contains X-Request-Id header, uses its value instead. (e.g. heroku)
       */
      id?: string;

      /**
       * Returns the value of the X-Api-Key header, if any.
       */
      apiKey?: string;
    }
  }
}
