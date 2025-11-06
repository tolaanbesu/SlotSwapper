import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getSwappableSlots, createSwapRequest, respondToSwapRequest, getRequests } from '../controllers/swapController.js';
const router = express.Router();

    router.get('/swappable-slots', authMiddleware, getSwappableSlots);
    router.post('/swap-request', authMiddleware, createSwapRequest);
    router.post('/swap-response/:id', authMiddleware, respondToSwapRequest);
    router.post('/swap-cancel/:id', authMiddleware, cancelSwapRequest);
    router.get('/requests', authMiddleware, getRequests);
    
export default router;
