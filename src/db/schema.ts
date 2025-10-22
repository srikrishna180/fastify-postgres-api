import {
    pgTable,
    timestamp,
    uuid,
    varchar,
    text,
} from 'drizzle-orm/pg-core'

const timestamps = {
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .$onUpdate(() => new Date()),
}

export const quotes = pgTable('quotes', {
    id: uuid('id').primaryKey().defaultRandom(),
    fullName: varchar('full_name', { length: 256 }),
    email: varchar('email', { length: 256 }),
    phone: varchar('phone', { length: 32 }),
    rego: varchar('rego', { length: 32 }),
    pickupAddress: varchar('pickup_address', { length: 512 }),
    notes: text('notes'),
    status: varchar('status', { length: 64 }),
    ...timestamps,
})
