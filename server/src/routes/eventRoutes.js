import { Router } from 'express';
import { eventService } from '../services/eventService.js';
import { validate } from '../middleware/validator.js';
import { createEventSchema, updateEventSchema } from '../utils/schemas.js';

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const result = await eventService.list({
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 20,
            personId: req.query.personId,
            type: req.query.type,
            direction: req.query.direction,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            minAmount: req.query.minAmount,
            maxAmount: req.query.maxAmount,
            sort: req.query.sort || 'event_date',
            order: req.query.order || 'desc',
        });
        res.json({ success: true, ...result });
    } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
    try {
        const data = await eventService.getById(req.params.id);
        res.json({ success: true, data });
    } catch (err) { next(err); }
});

router.post('/', validate(createEventSchema), async (req, res, next) => {
    try {
        const data = await eventService.create(req.body);
        res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
});

router.put('/:id', validate(updateEventSchema), async (req, res, next) => {
    try {
        const data = await eventService.update(req.params.id, req.body);
        res.json({ success: true, data });
    } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const data = await eventService.delete(req.params.id);
        res.json({ success: true, data });
    } catch (err) { next(err); }
});

export default router;
