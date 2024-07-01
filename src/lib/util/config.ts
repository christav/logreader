const LOG_FILES_DIR_ENV = 'LOG_FILES_DIR';
const PORT_ENV = 'PORT';
const LOG_LEVEL_ENV = 'LOG_LEVEL';

const DEFAULT_PORT = 3001;

export interface LogServerConfig {
  readonly logFilesDir: string;
  readonly port: number;
  readonly loglevel: string;
}

class ConfigFromEnv implements LogServerConfig {
  readonly logFilesDir: string;
  readonly port: number;
  readonly loglevel: string;

  constructor() {
    const logFilesDirFromEnv = process.env[LOG_FILES_DIR_ENV];
    if (!logFilesDirFromEnv) {
      throw new Error(`Missing required environment variable ${LOG_FILES_DIR_ENV}`);
    }
    this.logFilesDir = logFilesDirFromEnv;

    const portFromEnv = process.env[PORT_ENV];
    if (!portFromEnv) {
      this.port = DEFAULT_PORT;
    } else {
      this.port = parseInt(portFromEnv, 10);
      if (isNaN(this.port)) {
        this.port = DEFAULT_PORT;
      }
    }

    this.loglevel = process.env[LOG_LEVEL_ENV] || 'info';
  }
}

const config = new ConfigFromEnv();

export default config;
