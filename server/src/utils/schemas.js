import { z } from 'zod';

const relationships = ['FAMILY', 'FRIEND', 'COLLEAGUE', 'SCHOOL', 'NEIGHBOR', 'BUSINESS', 'OTHER'];
const eventTypes = ['WEDDING', 'FUNERAL', 'FIRST_BIRTHDAY', 'BIRTHDAY', 'PROMOTION', 'OPENING', 'HOUSEWARMING', 'RECOVERY', 'GRADUATION', 'OTHER'];
const directions = ['SENT', 'RECEIVED'];

export const createPersonSchema = z.object({
    name: z.string().min(1, '이름은 필수입니다.').max(100),
    relationship: z.enum(relationships, { errorMap: () => ({ message: '유효한 관계 유형을 선택하세요.' }) }),
    phone: z.string().max(20).optional().nullable(),
    memo: z.string().max(500).optional().nullable(),
    groupIds: z.array(z.string().uuid()).optional(),
});

export const updatePersonSchema = createPersonSchema.partial();

export const createEventSchema = z.object({
    personId: z.string().uuid('유효한 인물 ID가 필요합니다.'),
    type: z.enum(eventTypes, { errorMap: () => ({ message: '유효한 경조사 유형을 선택하세요.' }) }),
    direction: z.enum(directions, { errorMap: () => ({ message: 'SENT 또는 RECEIVED를 선택하세요.' }) }),
    amount: z.number().int().positive('금액은 양수여야 합니다.').max(100000000),
    eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD 형식이어야 합니다.'),
    memo: z.string().max(500).optional().nullable(),
});

export const updateEventSchema = createEventSchema.partial();

export const createGroupSchema = z.object({
    name: z.string().min(1, '그룹명은 필수입니다.').max(100),
    description: z.string().max(500).optional().nullable(),
});

export const updateGroupSchema = createGroupSchema.partial();

export { relationships, eventTypes, directions };
