import { Injectable, LoggerService, LogLevel } from '@nestjs/common';

@Injectable()
export class CentralizedLogger implements LoggerService {
  private logLevels: LogLevel[] = ['log', 'error', 'warn', 'debug', 'verbose'];

  log(message: any, context?: string) {
    this.printLog('LOG', message, context);
  }

  error(message: any, trace?: string, context?: string) {
    this.printLog('ERROR', message, context, trace);
  }

  warn(message: any, context?: string) {
    this.printLog('WARN', message, context);
  }

  debug(message: any, context?: string) {
    this.printLog('DEBUG', message, context);
  }

  verbose(message: any, context?: string) {
    this.printLog('VERBOSE', message, context);
  }

  private printLog(level: string, message: any, context?: string, trace?: string) {
    const timestamp = new Date().toISOString();
    const formattedContext = context ? `[${context}]` : '';
    const sanitizedMsg = this.sanitize(message);

    console.log(`${timestamp} [${level}] ${formattedContext} ${sanitizedMsg}`);
    if (trace) {
      console.error(`${timestamp} [TRACE] ${this.sanitize(trace)}`);
    }
  }

  public sanitize(obj: any): string {
    if (obj === null || obj === undefined) return '';
    if (typeof obj !== 'object') {
      return this.maskSensitiveString(String(obj));
    }

    try {
      const cloned = JSON.parse(JSON.stringify(obj));
      this.maskObjectFields(cloned);
      return JSON.stringify(cloned);
    } catch (e) {
      return this.maskSensitiveString(String(obj));
    }
  }

  private maskObjectFields(obj: any) {
    if (!obj || typeof obj !== 'object') return;
    const sensitiveKeys = ['password', 'passwordHash', 'token', 'jwt', 'secret', 'authorization', 'bearer', 'creditCard'];

    for (const key of Object.keys(obj)) {
      if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
        obj[key] = '[REDACTED]';
      } else if (typeof obj[key] === 'object') {
        this.maskObjectFields(obj[key]);
      }
    }
  }

  private maskSensitiveString(str: string): string {
    return str
      .replace(/("password"|"passwordHash"|"jwt"|"token"|"secret")\s*:\s*"[^"]+"/gi, '$1:"[REDACTED]"')
      .replace(/Bearer\s+[A-Za-z0-9\-\._~\+\/]+=*/gi, 'Bearer [REDACTED]');
  }
}
