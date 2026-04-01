type LogLevel = 'INFO' | 'WARN' | 'ERROR';

const log = (level: LogLevel, message: string, meta?: unknown): void => {
  const timestamp = new Date().toISOString();
  const payload = meta ? ` ${JSON.stringify(meta)}` : '';
  // Keep logs structured and compact for local debugging and future log shipping.
  console.log(`[${timestamp}] [${level}] ${message}${payload}`);
};

export const logger = {
  info: (message: string, meta?: unknown): void => log('INFO', message, meta),
  warn: (message: string, meta?: unknown): void => log('WARN', message, meta),
  error: (message: string, meta?: unknown): void => log('ERROR', message, meta),
};
