import { db } from '../db/index.js';
import { groups, personGroups, persons } from '../db/schema.js';
import { eq, and, count, sql } from 'drizzle-orm';
import { AppError } from '../middleware/errorHandler.js';

export const groupService = {
    async list(userId) {
        const data = await db.select({
            id: groups.id,
            name: groups.name,
            description: groups.description,
            memberCount: sql`(SELECT COUNT(*) FROM person_groups WHERE person_groups.group_id = ${groups.id})::int`,
            createdAt: groups.createdAt,
        }).from(groups).where(eq(groups.userId, userId)).orderBy(groups.name);
        return data;
    },

    async create(userId, data) {
        const [group] = await db.insert(groups).values({
            userId,
            name: data.name,
            description: data.description || null,
        }).returning();
        return group;
    },

    async update(userId, id, data) {
        const [existing] = await db.select().from(groups).where(and(eq(groups.id, id), eq(groups.userId, userId)));
        if (!existing) throw new AppError(404, 'NOT_FOUND', '그룹을 찾을 수 없습니다.');

        const [updated] = await db.update(groups).set(data).where(and(eq(groups.id, id), eq(groups.userId, userId))).returning();
        return updated;
    },

    async delete(userId, id) {
        const [existing] = await db.select().from(groups).where(and(eq(groups.id, id), eq(groups.userId, userId)));
        if (!existing) throw new AppError(404, 'NOT_FOUND', '그룹을 찾을 수 없습니다.');

        await db.delete(groups).where(and(eq(groups.id, id), eq(groups.userId, userId)));
        return { message: '그룹이 삭제되었습니다.' };
    },
};
