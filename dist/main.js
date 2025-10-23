"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const main = async () => {
    const fastify = await (0, server_1.createServer)();
    const port = Number(fastify.config.PORT);
    try {
        fastify.listen({ port }, () => {
            fastify.log.info(`Listening on ${port}...`);
        });
    }
    catch (error) {
        // fastify.log.error('fastify.listen:', error)
        fastify.log.error(error, 'fastify.listen:');
        process.exit(1);
    }
};
main();
//# sourceMappingURL=main.js.map