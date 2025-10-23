"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveQuotesHandler = exports.getQuotesHandler = void 0;
const db_1 = require("./db");
const getQuotesHandler = async (request, reply) => {
    const data = await (0, db_1.getQuotes)();
    return { data };
};
exports.getQuotesHandler = getQuotesHandler;
const saveQuotesHandler = async (request, reply) => {
    const { fullName, emailAddress, phone, regoNumber, pickupAddress, notes, status = "pending", } = request.body;
    const result = await (0, db_1.createQuote)({
        fullName,
        email: emailAddress,
        phone,
        rego: regoNumber,
        pickupAddress,
        notes,
        status
    });
    return result;
};
exports.saveQuotesHandler = saveQuotesHandler;
//# sourceMappingURL=handler.js.map