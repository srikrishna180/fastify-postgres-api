import '@fastify/jwt';

declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: {
            id: string;
            email: string;
            iat?: number;    // Issued at (timestamp)
            exp?: number;    // Expiration time (timestamp)
            nbf?: number;    // Not before (timestamp)
            iss?: string;    // Issuer
            sub?: string;    // Subject
            aud?: string | string[];  // Audience
        };
        user: {
            id: string;
            email: string;
            iat?: number;
            exp?: number;
            nbf?: number;
            iss?: string;
            sub?: string;
            aud?: string | string[];
        };
    }
}

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}
