import { db } from '../../db';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';

export async function createUser(email: string, hashedPassword: string, fullName?: string) {
    const [user] = await db
        .insert(users)
        .values({
            email,
            password: hashedPassword,
            fullName,
        })
        .returning();
    return user;
}

export async function findUserByEmail(email: string) {
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
    return user;
}

export async function findUserById(id: string) {
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
    return user;
}

// New function: Update user password and invalidate tokens
export async function updateUserPassword(userId: string, hashedPassword: string) {
    const [user] = await db
        .update(users)
        .set({
            password: hashedPassword,
            tokensValidAfter: new Date(),
        })
        .where(eq(users.id, userId))
        .returning();
    return user;
}

// New function: Invalidate all user tokens
export async function invalidateUserTokens(userId: string) {
    await db
        .update(users)
        .set({ tokensValidAfter: new Date() })
        .where(eq(users.id, userId));
}


