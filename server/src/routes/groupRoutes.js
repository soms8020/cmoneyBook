import { Router } from 'express';
import { groupService } from '../services/groupService.js';
import { validate } from '../middleware/validator.js';
import { createGroupSchema, updateGroupSchema } from '../utils/schemas.js';

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const data = await groupService.list(req.user.id);
        res.json({ success: true, data });
    } catch (err) { next(err); }
});

router.post('/', validate(createGroupSchema), async (req, res, next) => {
    try {
        const data = await groupService.create(req.user.id, req.body);
        res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
});

router.put('/:id', validate(updateGroupSchema), async (req, res, next) => {
    try {
        const data = await groupService.update(req.user.id, req.params.id, req.body);
        res.json({ success: true, data });
    } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const data = await groupService.delete(req.user.id, req.params.id);
        res.json({ success: true, data });
    } catch (err) { next(err); }
});

export default router;
