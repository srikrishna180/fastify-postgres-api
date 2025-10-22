import { FastifyReply, FastifyRequest } from 'fastify'
import {createQuotes, getQuotes} from './db'

export const getQuotesHandler = async (
    request: FastifyRequest,
    reply: FastifyReply,
) => {
    const data = await getQuotes()

    return { data }
}

export const saveQuotesHandler = async (
    request: FastifyRequest,
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

    const result = await createQuotes({
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
