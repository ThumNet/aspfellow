
export enum LogLevel {
  VERBOSE = 1,
  INFO,
  WARNING,
  ERROR,
  DEBUG,
  NONE
}

export interface AspSettings {
  logLevel: LogLevel;
}

export class AspConfig {
  private static _logLevel: LogLevel = LogLevel.NONE; // default

  static get LogLevel() : LogLevel {
    return this._logLevel;
  }

  static set LogLevel(level: LogLevel) {
    this._logLevel = level;
  }
}


let logLevelToLogMethod:Map<LogLevel, Function> = new Map();
let consoleContext: any;

export function setConsole(_console: { log: Function, info: Function, warn: Function, error: Function }): void {
  logLevelToLogMethod.set(LogLevel.VERBOSE, _console.log);
  logLevelToLogMethod.set(LogLevel.INFO, _console.info);
  logLevelToLogMethod.set(LogLevel.WARNING, _console.warn);
  logLevelToLogMethod.set(LogLevel.ERROR, _console.error);
  logLevelToLogMethod.set(LogLevel.DEBUG, _console.log);
  consoleContext = _console;
}
setConsole(console);

export function logIt(logConfig: { level: LogLevel, message: any } | any, ...rest: any[]) {
  if (AspConfig.LogLevel === LogLevel.NONE) return;
  
  let value: any = (logConfig && logConfig.level) ? logConfig.message : Array.prototype.join.call(arguments, ' ');
  let level: LogLevel = (logConfig && logConfig.level) || LogLevel.DEBUG;
  
  if (AspConfig.LogLevel > level) return;
  
  if (value instanceof Array) {
    value = value.join(' ');
  }
  
  logLevelToLogMethod.get(level).call(consoleContext, value);
}
