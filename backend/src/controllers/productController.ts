import { Request, Response } from 'express';

// In-memory Database Mock
export let PRODUCTS = [
    {
        id: 'prod-1',
        name: 'PEAK Performance Tee',
        description: 'Breathable, lightweight workout tee tailored for maximum mobility.',
        price: 35.99,
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
        createdAt: new Date().toISOString()
    },
    {
        id: 'prod-2',
        name: 'PEAK Pro Dumbbells (Pair)',
        description: 'Premium hex dumbbells with ergonomic grips. 25lbs each.',
        price: 120.00,
        imageUrl: 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?q=80&w=800&auto=format&fit=crop',
        createdAt: new Date().toISOString()
    },
    {
        id: 'prod-3',
        name: 'PEAK Recovery Protein',
        description: '100% Whey Isolate. Vanilla Bean flavor. 30 servings.',
        price: 45.00,
        imageUrl: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=800&auto=format&fit=crop',
        createdAt: new Date().toISOString()
    }
];

export const getProducts = async (req: Request, res: Response) => {
    try {
        // Return all products, newest first
        const sortedProducts = [...PRODUCTS].sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        res.json(sortedProducts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price, imageUrl } = req.body;

        const newProduct = {
            id: `prod-${Date.now()}`,
            name,
            description,
            price: parseFloat(price),
            imageUrl,
            createdAt: new Date().toISOString()
        };

        PRODUCTS.push(newProduct);

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error creating product' });
    }
};
