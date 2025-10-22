import { desc } from 'drizzle-orm'
import { db } from 'src/db'
import { quotes } from 'src/db/schema'

export const getQuotes = async () => {
    const result = await db
        .select()
        .from(quotes)
        // .orderBy(desc(quotes.created_at))

    return result
}

export const createQuotes = async (insertObject) => {
    const result = await db.insert(quotes).values(insertObject);

    return result.rowCount
}
