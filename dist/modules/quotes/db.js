"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuote = exports.getQuotes = void 0;
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const getQuotes = async () => {
    const result = await db_1.db
        .select()
        .from(schema_1.quotes);
    // .orderBy(desc(quotes.created_at))
    return result;
};
exports.getQuotes = getQuotes;
const createQuote = async (insertObject) => {
    const result = await db_1.db.insert(schema_1.quotes).values(insertObject);
    return result.rowCount;
};
exports.createQuote = createQuote;
//# sourceMappingURL=db.js.map