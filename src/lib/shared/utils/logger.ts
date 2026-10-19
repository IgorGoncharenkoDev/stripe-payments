type LogContext = Record<string, unknown>

function format(level: string, message: string, context?: LogContext) {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(context && {
      context,
    }),
  }
}

export const logger = {
  info(message: string, context?: LogContext) {
    console.log(JSON.stringify(format('INFO', message, context)))
  },

  error(message: string, context?: LogContext) {
    console.error(format('ERROR', message, context))
  },
}
