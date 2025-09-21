import express from 'express';
import { signup, login, logout, getMe, updateProfile } from '../controllers/auth.contoller.js';
import { protectRoute } from '../middleware/protectRoute.js';


const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protectRoute, getMe);
router.put('/update-profile', protectRoute, updateProfile);


export default router;
