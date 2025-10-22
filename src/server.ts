import Fastify from 'fastify'
import env from '@fastify/env'
import dotenv from 'dotenv'
import { createLogger } from 'src/utils/logger.js';
import type { Level } from 'src/utils/logger.js';
import {quotesRouter} from "src/modules/quotes/router.js";

dotenv.config()

const level = process.env.PINO_LOG_LEVEL as Level
const isDev = process.env.NODE_ENV === 'development'
const logger = createLogger({ level, isDev })

export { logger }

const schema = {
    type: 'object',
    required: ['PORT', 'DATABASE_URL'],
    properties: {
        PORT: {
            type: 'string',
            default: 3000,
        },
        DATABASE_URL: {
            type: 'string',
        },
        PINO_LOG_LEVEL: {
            type: 'string',
            default: 'error',
        },
        NODE_ENV: {
            type: 'string',
            default: 'production',
        },
    },
}

const options = {
    schema: schema,
    dotenv: true,
}

declare module 'fastify' {
    interface FastifyInstance {
        config: {
            PORT: string
            DATABASE_URL: string
            PINO_LOG_LEVEL: string
            NODE_ENV: string
        }
    }
}


export const createServer = async () => {
    const fastify = Fastify({
        loggerInstance: logger,
    })

    /* Register plugins */
    await fastify.register(env, options).after()

    fastify.get('/ping', (request, reply) => {
        reply.send({ message: 'pong' })
    })

    /* Add the quotes router under the `ping` endpoint */
    fastify.register(quotesRouter, { prefix: 'api/quotes' })

    return fastify
}
