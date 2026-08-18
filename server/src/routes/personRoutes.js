import { Router } from 'express';
import { personService } from '../services/personService.js';
import { validate } from '../middleware/validator.js';
import { createPersonSchema, updatePersonSchema } from '../utils/schemas.js';

const router = Router();

// 인물 목록 조회
router.get('/', async (req, res, next) => {
    try {
        const result = await personService.list(req.user.id, {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 20,
            search: req.query.search,
            relationship: req.query.relationship,
            sort: req.query.sort || 'name',
            order: req.query.order || 'asc',
        });
        res.json({ success: true, ...result });
    } catch (err) { next(err); }
});

// 인물 상세 조회
router.get('/:id', async (req, res, next) => {
    try {
        const data = await personService.getById(req.user.id, req.params.id);
        res.json({ success: true, data });
    } catch (err) { next(err); }
});

// 인물 등록
router.post('/', validate(createPersonSchema), async (req, res, next) => {
    try {
        const data = await personService.create(req.user.id, req.body);
        res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
});

// 인물 수정
router.put('/:id', validate(updatePersonSchema), async (req, res, next) => {
    try {
        const data = await personService.update(req.user.id, req.params.id, req.body);
        res.json({ success: true, data });
    } catch (err) { next(err); }
});

// 인물 삭제
router.delete('/:id', async (req, res, next) => {
    try {
        const data = await personService.delete(req.user.id, req.params.id);
        res.json({ success: true, data });
    } catch (err) { next(err); }
});

export default router;
