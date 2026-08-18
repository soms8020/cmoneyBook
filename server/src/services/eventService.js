import { db } from '../db/index.js';
import { events, persons } from '../db/schema.js';
import { eq, and, gte, lte, sql, count, between } from 'drizzle-orm';
import { AppError } from '../middleware/errorHandler.js';

export const eventService = {
    // 내역 목록 조회
    async list(userId, { page = 1, limit = 20, personId, type, direction, startDate, endDate, minAmount, maxAmount, sort = 'event_date', order = 'desc' }) {
        const offset = (page - 1) * limit;
        const conditions = [eq(events.userId, userId)];

        if (personId) conditions.push(eq(events.personId, personId));
        if (type) conditions.push(eq(events.type, type));
        if (direction) conditions.push(eq(events.direction, direction));
        if (startDate) conditions.push(gte(events.eventDate, startDate));
        if (endDate) conditions.push(lte(events.eventDate, endDate));
        if (minAmount) conditions.push(gte(events.amount, parseInt(minAmount)));
        if (maxAmount) conditions.push(lte(events.amount, parseInt(maxAmount)));

        const where = conditions.length > 0 ? and(...conditions) : undefined;

        const data = await db.select({
            id: events.id,
            personId: events.personId,
            personName: persons.name,
            personRelationship: persons.relationship,
            type: events.type,
            direction: events.direction,
            amount: events.amount,
            eventDate: events.eventDate,
            memo: events.memo,
            createdAt: events.createdAt,
        })
            .from(events)
            .innerJoin(persons, eq(events.personId, persons.id))
            .where(where)
            .orderBy(sort === 'amount'
                ? (order === 'desc' ? sql`${events.amount} DESC` : sql`${events.amount} ASC`)
                : (order === 'desc' ? sql`${events.eventDate} DESC` : sql`${events.eventDate} ASC`)
            )
            .limit(limit)
            .offset(offset);

        const [{ total: totalCount }] = await db.select({ total: count() }).from(events).where(where);

        return {
            data,
            meta: { page, limit, total: totalCount, totalPages: Math.ceil(totalCount / limit) },
        };
    },

    // 내역 상세
    async getById(userId, id) {
        const [event] = await db.select({
            id: events.id,
            personId: events.personId,
            personName: persons.name,
            personRelationship: persons.relationship,
            type: events.type,
            direction: events.direction,
            amount: events.amount,
            eventDate: events.eventDate,
            memo: events.memo,
            createdAt: events.createdAt,
            updatedAt: events.updatedAt,
        })
            .from(events)
            .innerJoin(persons, eq(events.personId, persons.id))
            .where(and(eq(events.id, id), eq(events.userId, userId)));

        if (!event) throw new AppError(404, 'NOT_FOUND', '내역을 찾을 수 없습니다.');
        return event;
    },

    // 내역 등록
    async create(userId, data) {
        // 인물 존재 확인 및 권한 확인
        const [person] = await db.select().from(persons).where(and(eq(persons.id, data.personId), eq(persons.userId, userId)));
        if (!person) throw new AppError(400, 'VALIDATION_ERROR', '존재하지 않는 인물이거나 접근 권한이 없습니다.');

        const [event] = await db.insert(events).values({
            userId,
            personId: data.personId,
            type: data.type,
            direction: data.direction,
            amount: data.amount,
            eventDate: data.eventDate,
            memo: data.memo || null,
        }).returning();
        return event;
    },

    // 내역 수정
    async update(userId, id, data) {
        const [existing] = await db.select().from(events).where(and(eq(events.id, id), eq(events.userId, userId)));
        if (!existing) throw new AppError(404, 'NOT_FOUND', '내역을 찾을 수 없습니다.');

        const [updated] = await db.update(events)
            .set({ ...data, updatedAt: new Date() })
            .where(and(eq(events.id, id), eq(events.userId, userId)))
            .returning();
        return updated;
    },

    // 내역 삭제
    async delete(userId, id) {
        const [existing] = await db.select().from(events).where(and(eq(events.id, id), eq(events.userId, userId)));
        if (!existing) throw new AppError(404, 'NOT_FOUND', '내역을 찾을 수 없습니다.');

        await db.delete(events).where(and(eq(events.id, id), eq(events.userId, userId)));
        return { message: '내역이 삭제되었습니다.' };
    },
};
