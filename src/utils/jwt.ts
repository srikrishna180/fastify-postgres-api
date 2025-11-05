import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import {findUserById} from "../modules/auth/db";

export async function registerJWT(fastify: FastifyInstance) {
    // Register JWT plugin
    fastify.register(fastifyJwt, {
        secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        sign: {
            expiresIn: '1h', // Token expires in 1 hour
        },
    });

    // Decorator for authenticating routes with token invalidation check
    fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            // Verify JWT signature
            await request.jwtVerify();

            // Additional check: verify token is still valid based on user's tokensValidAfter
            const user = await findUserById(request.user.id);

            if (!user) {
                return reply.code(401).send({ error: 'User not found' });
            }

            if (user.tokensValidAfter && request.user.iat) {
                const tokenIssuedAt = request.user.iat * 1000; // Convert to milliseconds
                const validAfter = user.tokensValidAfter.getTime();

                if (tokenIssuedAt < validAfter) {
                    return reply.code(401).send({ error: 'Token has been invalidated' });
                }
            }
        } catch (err) {
            reply.code(401).send({ error: 'Unauthorized' });
        }
    });
}


