import { FastifyInstance } from 'fastify';
import {
    registerHandler,
    loginHandler,
    meHandler,
    changePasswordHandler,
    logoutAllDevicesHandler,
} from './handler';

export async function authRoutes(fastify: FastifyInstance) {
    // Public routes
    fastify.post('/register', registerHandler);
    fastify.post('/login', loginHandler);

    // Protected routes (require JWT token)
    fastify.get('/me', {
        preHandler: [fastify.authenticate],
    }, meHandler);

    fastify.post('/change-password', {
        preHandler: [fastify.authenticate],
    }, changePasswordHandler);

    fastify.post('/logout-all-devices', {
        preHandler: [fastify.authenticate],
    }, logoutAllDevicesHandler);
}
