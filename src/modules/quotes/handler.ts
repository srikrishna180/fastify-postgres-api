import { FastifyReply, FastifyRequest } from 'fastify'
import {createQuote, getQuotes} from './db'

interface CreateQuoteBody {
    fullName: string
    emailAddress?: string
    phone: string
    regoNumber?: string
    pickupAddress: string
    notes?: string
    status?: string
}


export const getQuotesHandler = async (
    request: FastifyRequest,
    reply: FastifyReply,
) => {
    const data = await getQuotes()

    return { data }
}

export const saveQuotesHandler = async (
    request: FastifyRequest<{ Body: CreateQuoteBody }>,
    reply: FastifyReply,
) => {
    const {
        fullName,
        emailAddress,
        phone,
        regoNumber,
        pickupAddress,
        notes,
        status = "pending",
    } = request.body;

    const result = await createQuote({
        fullName,
        email: emailAddress,
        phone,
        rego: regoNumber,
        pickupAddress,
        notes,
        status
    })
    return result;
}
