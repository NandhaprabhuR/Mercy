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

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status }
        });

        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating order status' });
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

export const addOrderFeedback = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { rating, comments } = req.body;

        const order = await prisma.order.findUnique({ where: { id } });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const newStatus = ['RETURNED', 'REFUNDED', 'RETURN_REQUESTED'].includes(order.status)
            ? order.status
            : 'REVIEWED';

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                feedbackRating: rating,
                feedbackComment: comments,
                status: newStatus
            }
        });
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error("Error adding feedback:", error);
        res.status(500).json({ message: "Error adding feedback" });
    }
};
