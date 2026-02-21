import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

// Helper to seed initial products if the DB is empty
const seedProductsIfEmpty = async () => {
    const count = await prisma.product.count();
    if (count === 0) {
        await prisma.product.createMany({
            data: [
                {
                    name: 'PEAK Performance Tee',
                    description: 'Breathable, lightweight workout tee tailored for maximum mobility.',
                    price: 35.99,
                    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
                },
                {
                    name: 'PEAK Pro Dumbbells (Pair)',
                    description: 'Premium hex dumbbells with ergonomic grips. 25lbs each.',
                    price: 120.00,
                    imageUrl: 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?q=80&w=800&auto=format&fit=crop',
                },
                {
                    name: 'PEAK Recovery Protein',
                    description: '100% Whey Isolate. Vanilla Bean flavor. 30 servings.',
                    price: 45.00,
                    imageUrl: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=800&auto=format&fit=crop',
                }
            ]
        });
    }
};
// Fire and forget seeder
seedProductsIfEmpty().catch(console.error);

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: 'Error fetching products' });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price, imageUrl } = req.body;

        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                imageUrl
            }
        });

        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: 'Error creating product' });
    }
};
