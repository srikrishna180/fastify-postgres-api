import pino, { Level } from 'pino'

export type { Level }

type CreateLoggerArgs = {
    level: Level
    isDev: boolean
}

export const createLogger = ({ level, isDev }: CreateLoggerArgs) =>
    pino({
        level,
        redact: ['req.headers.authorization'],
        formatters: {
            level: (label) => {
                return { level: label.toUpperCase() }
            },
        },
        ...(isDev && { transport: { target: 'pino-pretty' } }),
    })
