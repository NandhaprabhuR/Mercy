import { Router } from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController';

const router = Router();

router.get('/', getProducts);
router.post('/', createProduct); // Admin only in real scenario
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
