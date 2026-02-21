import express from 'express';
import { getAddresses, addAddress, setDefaultAddress, deleteAddress } from '../controllers/addressController';

const router = express.Router();

router.get('/:userId', getAddresses);
router.post('/', addAddress);
router.put('/:id/default', setDefaultAddress);
router.delete('/:id', deleteAddress);

export default router;
