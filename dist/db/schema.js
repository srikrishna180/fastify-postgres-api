"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quotes = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const timestamps = {
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at')
        .defaultNow()
        .$onUpdate(() => new Date()),
};
exports.quotes = (0, pg_core_1.pgTable)('quotes', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    fullName: (0, pg_core_1.varchar)('full_name', { length: 256 }),
    email: (0, pg_core_1.varchar)('email', { length: 256 }),
    phone: (0, pg_core_1.varchar)('phone', { length: 32 }),
    rego: (0, pg_core_1.varchar)('rego', { length: 32 }),
    pickupAddress: (0, pg_core_1.varchar)('pickup_address', { length: 512 }),
    notes: (0, pg_core_1.text)('notes'),
    status: (0, pg_core_1.varchar)('status', { length: 64 }),
    ...timestamps,
});
//# sourceMappingURL=schema.js.map