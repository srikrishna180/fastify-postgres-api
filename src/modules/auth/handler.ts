import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcrypt';
import {
    createUser,
    findUserByEmail,
    findUserById,
    updateUserPassword,
    invalidateUserTokens,
} from './db';

interface RegisterBody {
    email: string;
    password: string;
    fullName?: string;
}

interface LoginBody {
    email: string;
    password: string;
}

interface ChangePasswordBody {
    oldPassword: string;
    newPassword: string;
}

export async function registerHandler(
    request: FastifyRequest<{ Body: RegisterBody }>,
    reply: FastifyReply
) {
    try {
        const { email, password, fullName } = request.body;

        if (!email || !password) {
            return reply.code(400).send({ error: 'Email and password are required' });
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return reply.code(409).send({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await createUser(email, hashedPassword, fullName);

        const token = request.server.jwt.sign({
            id: user.id,
            email: user.email,
        });

        return reply.code(201).send({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
            },
        });
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
    }
}

export async function loginHandler(
    request: FastifyRequest<{ Body: LoginBody }>,
    reply: FastifyReply
) {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return reply.code(400).send({ error: 'Email and password are required' });
        }

        const user = await findUserByEmail(email);
        if (!user) {
            return reply.code(401).send({ error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return reply.code(401).send({ error: 'Invalid credentials' });
        }

        const token = request.server.jwt.sign({
            id: user.id,
            email: user.email,
        });

        return reply.send({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
            },
        });
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
    }
}

export async function meHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        return reply.send({
            user: request.user,
        });
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
    }
}

export async function changePasswordHandler(
    request: FastifyRequest<{ Body: ChangePasswordBody }>,
    reply: FastifyReply
) {
    try {
        const userId = request.user.id;
        const { oldPassword, newPassword } = request.body;

        if (!oldPassword || !newPassword) {
            return reply.code(400).send({ error: 'Old password and new password are required' });
        }

        if (newPassword.length < 8) {
            return reply.code(400).send({ error: 'New password must be at least 8 characters' });
        }

        const user = await findUserById(userId);
        if (!user) {
            return reply.code(404).send({ error: 'User not found' });
        }

        const isValidPassword = await bcrypt.compare(oldPassword, user.password);
        if (!isValidPassword) {
            return reply.code(401).send({ error: 'Current password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Now using the db function instead of raw query
        await updateUserPassword(userId, hashedPassword);

        return reply.send({
            message: 'Password changed successfully. Please log in again with your new password.',
        });
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
    }
}

export async function logoutAllDevicesHandler(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        const userId = request.user.id;

        // Using the db function
        await invalidateUserTokens(userId);

        return reply.send({
            message: 'Logged out from all devices successfully. Please log in again.',
        });
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
    }
}
