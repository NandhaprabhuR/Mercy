import { Request, Response } from 'express';

export const ORDERS: any[] = [];

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { userId, shippingAddress, totalAmount, productIdsJson } = req.body;

        if (!userId || !shippingAddress) {
            return res.status(400).json({ message: 'User ID and Shipping Address are required' });
        }

        const newOrder = {
            id: `order-${Date.now()}`,
            userId,
            shippingAddress,
            totalAmount: parseFloat(totalAmount),
            productIdsJson,
            status: 'PENDING',
            createdAt: new Date().toISOString()
        };

        ORDERS.push(newOrder);

        res.status(201).json({ message: 'Order placed successfully!', order: newOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing checkout/order' });
    }
};
