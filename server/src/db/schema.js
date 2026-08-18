import { pgTable, uuid, varchar, text, integer, date, timestamp, pgEnum } from 'drizzle-orm/pg-core';

// Enum 정의
export const relationshipEnum = pgEnum('relationship', [
  'FAMILY', 'FRIEND', 'COLLEAGUE', 'SCHOOL', 'NEIGHBOR', 'BUSINESS', 'OTHER'
]);

export const eventTypeEnum = pgEnum('event_type', [
  'WEDDING', 'FUNERAL', 'FIRST_BIRTHDAY', 'BIRTHDAY', 'PROMOTION',
  'OPENING', 'HOUSEWARMING', 'RECOVERY', 'GRADUATION', 'OTHER'
]);

export const directionEnum = pgEnum('direction', ['SENT', 'RECEIVED']);

// 인물 테이블
export const persons = pgTable('persons', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  relationship: relationshipEnum('relationship').notNull(),
  phone: varchar('phone', { length: 20 }),
  memo: text('memo'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 경조사 내역 테이블
export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  personId: uuid('person_id').references(() => persons.id, { onDelete: 'cascade' }).notNull(),
  type: eventTypeEnum('type').notNull(),
  direction: directionEnum('direction').notNull(),
  amount: integer('amount').notNull(),
  eventDate: date('event_date').notNull(),
  memo: text('memo'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 그룹 테이블
export const groups = pgTable('groups', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 인물-그룹 매핑 테이블
export const personGroups = pgTable('person_groups', {
  id: uuid('id').defaultRandom().primaryKey(),
  personId: uuid('person_id').references(() => persons.id, { onDelete: 'cascade' }).notNull(),
  groupId: uuid('group_id').references(() => groups.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
