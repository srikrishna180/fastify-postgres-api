import { desc } from 'drizzle-orm'
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
