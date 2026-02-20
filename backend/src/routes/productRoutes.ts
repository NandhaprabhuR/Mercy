import { Router } from 'express';
import { getProducts, createProduct } from '../controllers/productController';

const router = Router();

router.get('/', getProducts);
router.post('/', createProduct); // Admin only in real scenario

export default router;
