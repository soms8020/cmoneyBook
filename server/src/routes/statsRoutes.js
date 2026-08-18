import { Router } from 'express';
import { statsService } from '../services/statsService.js';

const router = Router();

router.get('/summary', async (req, res, next) => {
    try {
        const data = await statsService.summary(req.user.id, req.query.year ? parseInt(req.query.year) : null);
        res.json({ success: true, data });
    } catch (err) { next(err); }
});

router.get('/monthly', async (req, res, next) => {
    try {
        const data = await statsService.monthly(req.user.id, req.query.year ? parseInt(req.query.year) : null);
        res.json({ success: true, data });
    } catch (err) { next(err); }
});

router.get('/by-relationship', async (req, res, next) => {
    try {
        const data = await statsService.byRelationship(req.user.id);
        res.json({ success: true, data });
    } catch (err) { next(err); }
});

router.get('/by-type', async (req, res, next) => {
    try {
        const data = await statsService.byType(req.user.id);
        res.json({ success: true, data });
    } catch (err) { next(err); }
});

router.get('/recommendation', async (req, res, next) => {
    try {
        const data = await statsService.recommendation(req.user.id, {
            personId: req.query.personId,
            type: req.query.type,
            relationship: req.query.relationship,
        });
        res.json({ success: true, data });
    } catch (err) { next(err); }
});

export default router;
