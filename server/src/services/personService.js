import { db } from '../db/index.js';
import { persons, events } from '../db/schema.js';
import { eq, ilike, sql, and, count } from 'drizzle-orm';
import { AppError } from '../middleware/errorHandler.js';

export const personService = {
    // 인물 목록 조회
    async list({ page = 1, limit = 20, search, relationship, sort = 'name', order = 'asc' }) {
        const offset = (page - 1) * limit;
        const conditions = [];

        if (search) conditions.push(ilike(persons.name, `%${search}%`));
        if (relationship) conditions.push(eq(persons.relationship, relationship));

        const where = conditions.length > 0 ? and(...conditions) : undefined;

        const data = await db.select({
            id: persons.id,
            name: persons.name,
            relationship: persons.relationship,
            phone: persons.phone,
            memo: persons.memo,
            createdAt: persons.createdAt,
            updatedAt: persons.updatedAt,
            totalSent: sql`COALESCE(SUM(CASE WHEN ${events.direction} = 'SENT' THEN ${events.amount} ELSE 0 END), 0)::int`.as('total_sent'),
            totalReceived: sql`COALESCE(SUM(CASE WHEN ${events.direction} = 'RECEIVED' THEN ${events.amount} ELSE 0 END), 0)::int`.as('total_received'),
            balance: sql`(COALESCE(SUM(CASE WHEN ${events.direction} = 'RECEIVED' THEN ${events.amount} ELSE 0 END), 0) - COALESCE(SUM(CASE WHEN ${events.direction} = 'SENT' THEN ${events.amount} ELSE 0 END), 0))::int`.as('balance'),
        })
            .from(persons)
            .leftJoin(events, eq(persons.id, events.personId))
            .where(where)
            .groupBy(persons.id, persons.name, persons.relationship, persons.phone, persons.memo, persons.createdAt, persons.updatedAt)
            .orderBy(sort === 'name'
                ? (order === 'desc' ? sql`${persons.name} DESC` : sql`${persons.name} ASC`)
                : (order === 'desc' ? sql`${persons.createdAt} DESC` : sql`${persons.createdAt} ASC`)
            )
            .limit(limit)
            .offset(offset);

        const [{ total: totalCount }] = await db.select({ total: count() }).from(persons).where(where);

        return {
            data,
            meta: { page, limit, total: totalCount, totalPages: Math.ceil(totalCount / limit) },
        };
    },

    // 인물 상세 조회
    async getById(id) {
        const [person] = await db.select().from(persons).where(eq(persons.id, id));
        if (!person) throw new AppError(404, 'NOT_FOUND', '인물을 찾을 수 없습니다.');

        const personEvents = await db.select().from(events)
            .where(eq(events.personId, id))
            .orderBy(sql`${events.eventDate} DESC`);

        const totalSent = personEvents.filter(e => e.direction === 'SENT').reduce((s, e) => s + e.amount, 0);
        const totalReceived = personEvents.filter(e => e.direction === 'RECEIVED').reduce((s, e) => s + e.amount, 0);

        return {
            ...person,
            totalSent,
            totalReceived,
            balance: totalReceived - totalSent,
            events: personEvents,
        };
    },

    // 인물 등록
    async create(data) {
        const [person] = await db.insert(persons).values({
            name: data.name,
            relationship: data.relationship,
            phone: data.phone || null,
            memo: data.memo || null,
        }).returning();
        return person;
    },

    // 인물 수정
    async update(id, data) {
        const [existing] = await db.select().from(persons).where(eq(persons.id, id));
        if (!existing) throw new AppError(404, 'NOT_FOUND', '인물을 찾을 수 없습니다.');

        const [updated] = await db.update(persons)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(persons.id, id))
            .returning();
        return updated;
    },

    // 인물 삭제
    async delete(id) {
        const [existing] = await db.select().from(persons).where(eq(persons.id, id));
        if (!existing) throw new AppError(404, 'NOT_FOUND', '인물을 찾을 수 없습니다.');

        await db.delete(persons).where(eq(persons.id, id));
        return { message: '인물이 삭제되었습니다.' };
    },
};
