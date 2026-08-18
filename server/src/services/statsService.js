import { db } from '../db/index.js';
import { events, persons } from '../db/schema.js';
import { eq, sql, and } from 'drizzle-orm';

export const statsService = {
    // 대시보드 요약
    async summary(year) {
        const conditions = [];
        if (year) conditions.push(sql`EXTRACT(YEAR FROM ${events.eventDate}::date) = ${year}`);
        const where = conditions.length > 0 ? and(...conditions) : undefined;

        const [result] = await db.select({
            totalSent: sql`COALESCE(SUM(CASE WHEN ${events.direction} = 'SENT' THEN ${events.amount} ELSE 0 END), 0)::int`,
            totalReceived: sql`COALESCE(SUM(CASE WHEN ${events.direction} = 'RECEIVED' THEN ${events.amount} ELSE 0 END), 0)::int`,
            eventCount: sql`COUNT(*)::int`,
            sentCount: sql`COUNT(CASE WHEN ${events.direction} = 'SENT' THEN 1 END)::int`,
            receivedCount: sql`COUNT(CASE WHEN ${events.direction} = 'RECEIVED' THEN 1 END)::int`,
        }).from(events).where(where);

        return {
            ...result,
            balance: result.totalReceived - result.totalSent,
            avgSentAmount: result.sentCount > 0 ? Math.round(result.totalSent / result.sentCount) : 0,
            avgReceivedAmount: result.receivedCount > 0 ? Math.round(result.totalReceived / result.receivedCount) : 0,
        };
    },

    // 월별 통계
    async monthly(year) {
        const targetYear = year || new Date().getFullYear();
        const data = await db.select({
            month: sql`TO_CHAR(${events.eventDate}::date, 'YYYY-MM')`.as('month'),
            sent: sql`COALESCE(SUM(CASE WHEN ${events.direction} = 'SENT' THEN ${events.amount} ELSE 0 END), 0)::int`,
            received: sql`COALESCE(SUM(CASE WHEN ${events.direction} = 'RECEIVED' THEN ${events.amount} ELSE 0 END), 0)::int`,
            sentCount: sql`COUNT(CASE WHEN ${events.direction} = 'SENT' THEN 1 END)::int`,
            receivedCount: sql`COUNT(CASE WHEN ${events.direction} = 'RECEIVED' THEN 1 END)::int`,
        })
            .from(events)
            .where(sql`EXTRACT(YEAR FROM ${events.eventDate}::date) = ${targetYear}`)
            .groupBy(sql`TO_CHAR(${events.eventDate}::date, 'YYYY-MM')`)
            .orderBy(sql`TO_CHAR(${events.eventDate}::date, 'YYYY-MM')`);

        return data;
    },

    // 관계별 통계
    async byRelationship() {
        const data = await db.select({
            relationship: persons.relationship,
            totalSent: sql`COALESCE(SUM(CASE WHEN ${events.direction} = 'SENT' THEN ${events.amount} ELSE 0 END), 0)::int`,
            totalReceived: sql`COALESCE(SUM(CASE WHEN ${events.direction} = 'RECEIVED' THEN ${events.amount} ELSE 0 END), 0)::int`,
            count: sql`COUNT(*)::int`,
        })
            .from(events)
            .innerJoin(persons, eq(events.personId, persons.id))
            .groupBy(persons.relationship);

        return data;
    },

    // 유형별 통계
    async byType() {
        const data = await db.select({
            type: events.type,
            avgAmount: sql`ROUND(AVG(${events.amount}))::int`,
            minAmount: sql`MIN(${events.amount})::int`,
            maxAmount: sql`MAX(${events.amount})::int`,
            count: sql`COUNT(*)::int`,
        })
            .from(events)
            .groupBy(events.type);

        return data;
    },

    // 추천 금액
    async recommendation({ personId, type, relationship }) {
        let avgByType = 0;
        let avgByRelationship = 0;
        let previousWithPerson = 0;

        if (type) {
            const [r] = await db.select({ avg: sql`COALESCE(ROUND(AVG(${events.amount})), 0)::int` })
                .from(events).where(eq(events.type, type));
            avgByType = r?.avg || 0;
        }

        if (relationship) {
            const [r] = await db.select({ avg: sql`COALESCE(ROUND(AVG(${events.amount})), 0)::int` })
                .from(events)
                .innerJoin(persons, eq(events.personId, persons.id))
                .where(eq(persons.relationship, relationship));
            avgByRelationship = r?.avg || 0;
        }

        if (personId) {
            const [r] = await db.select({ avg: sql`COALESCE(ROUND(AVG(${events.amount})), 0)::int` })
                .from(events)
                .where(and(eq(events.personId, personId), eq(events.direction, 'RECEIVED')));
            previousWithPerson = r?.avg || 0;
        }

        const recommended = Math.round((avgByType + avgByRelationship + (previousWithPerson || avgByType)) / 3 / 10000) * 10000;

        return {
            recommendedAmount: recommended || 50000,
            basis: { avgByType, avgByRelationship, previousWithPerson },
            range: {
                min: Math.max(30000, recommended - 50000),
                max: recommended + 50000 || 100000,
            },
        };
    },
};
