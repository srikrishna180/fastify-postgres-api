"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quotesRouter = void 0;
const handler_1 = require("./handler");
const quotesRouter = (fastify) => {
    fastify.get('/', handler_1.getQuotesHandler);
    fastify.post('/', handler_1.saveQuotesHandler);
};
exports.quotesRouter = quotesRouter;
//# sourceMappingURL=router.js.map