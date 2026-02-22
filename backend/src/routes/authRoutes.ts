import { Router } from 'express';
import { login, register, updateProfile, getAllUsers } from '../controllers/authController';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.put('/profile', updateProfile);
router.get('/users', getAllUsers);

export default router;
