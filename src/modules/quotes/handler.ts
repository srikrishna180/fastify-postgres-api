import { FastifyReply, FastifyRequest } from 'fastify'
import {createQuote, deleteQuoteById, getQuoteById, getQuotes, updateQuoteById} from './db'

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

export const updateQuotesHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const updates = request.body as Record<string, any>;

    if (!id) {
        return reply.code(400).send({ error: "Missing quote ID" });
    }

    if (!updates || Object.keys(updates).length === 0) {
        return reply.code(400).send({ error: "No fields provided to update" });
    }

    // Automatically add updated_at timestamp
    updates.updatedAt = new Date();

    const result = await updateQuoteById(id, updates);
    reply.send(result?.rowCount);

}

export const deleteQuotesByIdHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const result = await deleteQuoteById(id);
    reply.send(result?.rowCount);
}

export const getQuotesByIdHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    reply.send(await getQuoteById(id));
}
