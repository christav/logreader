const LOG_FILES_DIR_ENV = 'LOG_FILES_DIR';

export interface LogServerConfig {
  readonly logFilesDir: string;
}

class ConfigFromEnv implements LogServerConfig {
  readonly logFilesDir: string;

  constructor() {
    const logFilesDirFromEnv = process.env[LOG_FILES_DIR_ENV];
    if (!logFilesDirFromEnv) {
      throw new Error(`Missing required environment variable ${LOG_FILES_DIR_ENV}`);
    }
    this.logFilesDir = logFilesDirFromEnv;
  }
}

const config = new ConfigFromEnv();

export default config;
