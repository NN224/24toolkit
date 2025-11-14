/**
 * Structured logging utilities for production
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: {
    message: string;
    stack?: string;
  };
}

/**
 * Structured logger with different log levels
 */
class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production';
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
    };

    if (context && Object.keys(context).length > 0) {
      entry.context = context;
    }

    if (error) {
      entry.error = {
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
      };
    }

    // In production, output as JSON for better log aggregation
    if (!this.isDevelopment) {
      console.log(JSON.stringify(entry));
    } else {
      // In development, output human-readable format
      const prefix = `[${entry.timestamp}] ${level.toUpperCase()}:`;
      console.log(prefix, message, context || '', error || '');
    }
  }

  debug(message: string, context?: Record<string, any>) {
    if (this.isDevelopment) {
      this.log('debug', message, context);
    }
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log('error', message, context, error);
  }

  /**
   * Log API request
   */
  logRequest(method: string, path: string, context?: Record<string, any>) {
    this.info(`${method} ${path}`, {
      ...context,
      type: 'request',
    });
  }

  /**
   * Log API response
   */
  logResponse(method: string, path: string, statusCode: number, duration: number, context?: Record<string, any>) {
    this.info(`${method} ${path} - ${statusCode}`, {
      ...context,
      type: 'response',
      statusCode,
      duration: `${duration}ms`,
    });
  }
}

export const logger = new Logger();
