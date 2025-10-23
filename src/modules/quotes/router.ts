import type { FastifyInstance } from 'fastify'
import {
    getQuotesByIdHandler,
    getQuotesHandler,
    saveQuotesHandler,
    deleteQuotesByIdHandler,
    updateQuotesHandler
} from './handler'

export const quotesRouter = (fastify: FastifyInstance) => {
    fastify.get('/', getQuotesHandler)
    fastify.post('/', saveQuotesHandler)
    fastify.get('/:id', getQuotesByIdHandler)
    fastify.post('/:id', updateQuotesHandler)
    fastify.delete('/:id', deleteQuotesByIdHandler)
}
