import type { FastifyInstance } from 'fastify'
import {getQuotesHandler, saveQuotesHandler} from './handler'

export const quotesRouter = (fastify: FastifyInstance) => {
    fastify.get('/', getQuotesHandler)
    fastify.post('/', saveQuotesHandler)
}
