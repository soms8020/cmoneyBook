import { db } from '../db/index.js';
import { groups, personGroups, persons } from '../db/schema.js';
import { eq, count, sql } from 'drizzle-orm';
import { AppError } from '../middleware/errorHandler.js';

export const groupService = {
    async list() {
        const data = await db.select({
            id: groups.id,
            name: groups.name,
            description: groups.description,
            memberCount: sql`(SELECT COUNT(*) FROM person_groups WHERE person_groups.group_id = ${groups.id})::int`,
            createdAt: groups.createdAt,
        }).from(groups).orderBy(groups.name);
        return data;
    },

    async create(data) {
        const [group] = await db.insert(groups).values({
            name: data.name,
            description: data.description || null,
        }).returning();
        return group;
    },

    async update(id, data) {
        const [existing] = await db.select().from(groups).where(eq(groups.id, id));
        if (!existing) throw new AppError(404, 'NOT_FOUND', '그룹을 찾을 수 없습니다.');

        const [updated] = await db.update(groups).set(data).where(eq(groups.id, id)).returning();
        return updated;
    },

    async delete(id) {
        const [existing] = await db.select().from(groups).where(eq(groups.id, id));
        if (!existing) throw new AppError(404, 'NOT_FOUND', '그룹을 찾을 수 없습니다.');

        await db.delete(groups).where(eq(groups.id, id));
        return { message: '그룹이 삭제되었습니다.' };
    },
};
