import { Request, Response } from 'express';
// We will import Prisma client here later
// import prisma from '../prismaClient';

// Mock data acting as database until Prisma is fully set up
const DUMMY_POSTS = [
    {
        id: 'post-1',
        author: { username: 'thepeakbrand', avatarUrl: '' },
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop',
        likes: 12450,
        caption: 'Push your limits. The new collection is dropping soon.',
        overlayType: 'diagonal-green',
        overlayTextLine1: 'READY',
        overlayTextLine2: 'TO REACH',
        overlayTextLine3: 'HIGHER?'
    },
    {
        id: 'post-2',
        author: { username: 'thepeakbrand', avatarUrl: '' },
        imageUrl: 'https://images.unsplash.com/photo-1556816723-1ce827b9ef96?q=80&w=1000&auto=format&fit=crop',
        likes: 8900,
        caption: 'Elevate your everyday. Link in bio to shop.',
        overlayType: 'bottom-gradient',
        overlayTextLine1: '/NEW/ HEIGHTS. /NEW/ GEAR',
    },
    {
        id: 'post-3',
        author: { username: 'thepeakbrand', avatarUrl: '' },
        imageUrl: 'https://images.unsplash.com/photo-1552674605-171ff53544cb?q=80&w=1000&auto=format&fit=crop',
        likes: 21304,
        caption: 'Celebrate the wins. You earned it.',
        overlayType: 'diagonal-white',
        overlayTextLine1: 'YOUR',
        overlayTextLine2: 'JOURNEY',
        overlayTextLine3: 'INSPIRES',
        overlayTextLine4: 'OURS'
    }
];

export const getPosts = async (req: Request, res: Response) => {
    try {
        // Later: const posts = await prisma.post.findMany({ include: { author: true } });
        res.json(DUMMY_POSTS);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts' });
    }
};

export const createPost = async (req: Request, res: Response) => {
    try {
        const newPost = req.body;
        // Later: await prisma.post.create({ data: newPost });
        res.status(201).json({ message: 'Post created (mock)', post: newPost });
    } catch (error) {
        res.status(500).json({ message: 'Error creating post' });
    }
};
