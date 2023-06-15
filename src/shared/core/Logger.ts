import winston from 'winston';

export class Logger {
  private internalLogger: winston.Logger;

  constructor(source: string) {
    this.internalLogger = winston.createLogger({
      level: 'debug',
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.label({ label: source, message: false }),
        winston.format.timestamp(),
        winston.format.json(),
      ),
    });
  }

  public local(message: string): void {
    this.internalLogger.silly(message);
  }

  public debug(message: string): void {
    this.internalLogger.debug(message);
  }

  public http(message: string): void {
    this.internalLogger.http(message);
  }

  public info(message: string): void {
    this.internalLogger.info(message);
  }

  public warning(message: string): void {
    this.internalLogger.warn(message);
  }

  public error(message: string): void {
    this.internalLogger.error(message);
  }
}
