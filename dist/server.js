"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = exports.logger = void 0;
const fastify_1 = __importDefault(require("fastify"));
const env_1 = __importDefault(require("@fastify/env"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("./utils/logger");
const router_1 = require("./modules/quotes/router");
dotenv_1.default.config();
const level = process.env.PINO_LOG_LEVEL;
const isDev = process.env.NODE_ENV === 'development';
const logger = (0, logger_1.createLogger)({ level, isDev });
exports.logger = logger;
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
};
const options = {
    schema: schema,
    dotenv: true,
};
const createServer = async () => {
    const fastify = (0, fastify_1.default)({
        loggerInstance: logger,
    });
    /* Register plugins */
    await fastify.register(env_1.default, options).after();
    fastify.get('/ping', (request, reply) => {
        reply.send({ message: 'pong' });
    });
    /* Add the quotes router under the `ping` endpoint */
    fastify.register(router_1.quotesRouter, { prefix: 'api/quotes' });
    return fastify;
};
exports.createServer = createServer;
//# sourceMappingURL=server.js.map