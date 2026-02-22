import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

// Helper to seed initial products if the DB is empty
const seedProductsIfEmpty = async () => {
    const count = await prisma.product.count();
    if (count === 0) {
        await prisma.product.createMany({
            data: [
                {
                    name: 'NexCart Performance Tee',
                    description: 'Breathable, lightweight workout tee tailored for maximum mobility.',
                    price: 35.99,
                    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
                    category: 'Apparel',
                    isVeg: true
                },
                {
                    name: 'NexCart Pro Dumbbells (Pair)',
                    description: 'Premium hex dumbbells with ergonomic grips. 25lbs each.',
                    price: 120.00,
                    imageUrl: 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?q=80&w=800&auto=format&fit=crop',
                    category: 'Equipment',
                    isVeg: true
                },
                {
                    name: 'NexCart Recovery Protein',
                    description: '100% Whey Isolate. Vanilla Bean flavor. 30 servings.',
                    price: 45.00,
                    imageUrl: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=800&auto=format&fit=crop',
                    category: 'Supplements',
                    isVeg: true
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
        const { name, description, price, imageUrl, category, isVeg } = req.body;

        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                imageUrl,
                category: category || null,
                isVeg: isVeg !== undefined ? Boolean(isVeg) : true
            }
        });

        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: 'Error creating product' });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { name, description, price, imageUrl, category, isVeg } = req.body;

        const existing = await prisma.product.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                name: name || existing.name,
                description: description || existing.description,
                price: price !== undefined ? parseFloat(price) : existing.price,
                imageUrl: imageUrl || existing.imageUrl,
                category: category !== undefined ? category : existing.category,
                isVeg: isVeg !== undefined ? Boolean(isVeg) : existing.isVeg
            }
        });

        res.json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: 'Error updating product' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await prisma.product.delete({
            where: { id }
        });
        res.json({ message: 'Product deleted' });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: 'Error deleting product' });
    }
};
