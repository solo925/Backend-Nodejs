import express from 'express';
import individualRoutes from './individualRoutes';
import otherRoutes from './otherRoutes';

const router = express.Router();

// Use the individual routes with :id
router.use('/events', individualRoutes);

// Use other routes
router.use('/events', otherRoutes);

export default router;
