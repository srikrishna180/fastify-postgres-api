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
});


// New users table for authentication
export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    fullName: varchar('full_name', { length: 255 }),
    tokensValidAfter: timestamp('tokens_valid_after').defaultNow(), // New field
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Add refresh tokens table
export const refreshTokens = pgTable('refresh_tokens', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    token: varchar('token', { length: 500 }).notNull().unique(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});