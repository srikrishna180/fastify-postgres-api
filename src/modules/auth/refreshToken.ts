import { db } from '../../db';
import { refreshTokens } from '../../db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export async function createRefreshToken(userId: string) {
    const token = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    const [refreshToken] = await db
        .insert(refreshTokens)
        .values({
            userId,
            token,
            expiresAt,
        })
        .returning();

    return refreshToken;
}

export async function findRefreshToken(token: string) {
    const [refreshToken] = await db
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.token, token))
        .limit(1);

    return refreshToken;
}

export async function deleteRefreshToken(token: string) {
    await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
}

export async function deleteUserRefreshTokens(userId: string) {
    await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
}
