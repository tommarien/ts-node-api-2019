import { LevelWithSilent } from "pino";
import { Environment } from "./api";

declare global {

  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      LOG_LEVEL?: LevelWithSilent;
      RUNTIME_ENV?: Environment;
      GRACEFUL_SHUTDOWN?: string;
    }
  }

}
