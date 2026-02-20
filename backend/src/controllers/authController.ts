import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

// Helper to ensure an admin exists for testing purposes
const ensureAdminExists = async () => {
    const admin = await prisma.user.findUnique({ where: { username: 'admin' } });
    if (!admin) {
        await prisma.user.create({
            data: { username: 'admin', role: 'ADMIN' }
            // Note: In real app, hash password to DB here. For this prototype, auth is simplified.
        });
    }
};
// Fire and forget
ensureAdminExists().catch(console.error);

export const login = async (req: Request, res: Response) => {
    const { username } = req.body;
    // Note: Bypassing strict password check for prototype simplicity since DB has no password field

    try {
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (user) {
            // Simulate a token
            res.json({
                token: `mock-jwt-${user.id}`,
                user: { id: user.id, username: user.username, role: user.role }
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
};

export const register = async (req: Request, res: Response) => {
    const { username } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { username } });

        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const newUser = await prisma.user.create({
            data: {
                username,
                role: 'CONSUMER'
            }
        });

        res.status(201).json({
            token: `mock-jwt-${newUser.id}`,
            user: { id: newUser.id, username: newUser.username, role: newUser.role }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
};
