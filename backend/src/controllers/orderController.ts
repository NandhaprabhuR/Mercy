import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

// Get orders (Could be scoped to user if we had auth middleware, but doing a global fetch for admin/demo)
export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            include: { user: true }, // Include user details if needed
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

// Get orders belonging exclusively to a specific user
export const getUserOrders = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const orders = await prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user orders' });
    }
};

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { userId, shippingAddress, totalAmount, productIdsJson } = req.body;

        if (!userId || !shippingAddress) {
            return res.status(400).json({ message: 'User ID and Shipping Address are required' });
        }

        const newOrder = await prisma.order.create({
            data: {
                userId,
                shippingAddress,
                totalAmount: parseFloat(totalAmount),
                productIdsJson,
                status: 'PENDING'
            }
        });

        res.status(201).json({ message: 'Order placed successfully!', order: newOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing checkout/order' });
    }
};
