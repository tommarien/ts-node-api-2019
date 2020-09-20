import { LevelWithSilent } from "pino";

declare global {

  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string | number;
      LOG_LEVEL?: LevelWithSilent;
    }
  }
}
