import {desc, eq} from 'drizzle-orm'
import { db } from '../../db'
import { quotes } from '../../db/schema'

export const getQuotes = async () => {
    const result = await db
        .select()
        .from(quotes)
        // .orderBy(desc(quotes.created_at))

    return result
}

export const createQuote = async (insertObject: any) => {
    const result = await db.insert(quotes).values(insertObject);

    return result.rowCount
}

export const getQuoteById = async (id: string) => await db.select().from(quotes).where(eq(quotes.id, id));

export const updateQuoteById = async (id: string, updateObject: any) => await db.update(quotes).set(updateObject).where(eq(quotes.id, id));

export const deleteQuoteById = async (id: string) => await db.delete(quotes).where(eq(quotes.id, id));
