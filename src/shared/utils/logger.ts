type LogContext = Record<string, string | number | boolean | undefined>

export const logger = {
  error(message: string, context: LogContext = {}): void {
    if (import.meta.env.DEV) console.error(JSON.stringify({ level: 'error', message, context, timestamp: new Date().toISOString() }))
  },
}
