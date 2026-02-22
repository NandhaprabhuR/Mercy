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
    const { username, password } = req.body;

    // Strict requirement: only "admin" with password "123456" can login as the admin role.
    if (username === 'admin' && password !== '123456') {
        return res.status(401).json({ message: 'Invalid admin credentials' });
    }

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

export const updateProfile = async (req: Request, res: Response) => {
    const { userId, oldPassword, newPassword, avatarUrl } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Mock verification: In a real app we'd bcrypt.compare(oldPassword, user.passwordHash)
        // Since this prototype has no password hash field, we just accept any string for oldPassword to simulate success,
        // or check if it matches some hardcoded value if we wanted strictness. We'll simply let it pass as a mock.
        if (oldPassword && oldPassword.length < 1) {
            return res.status(400).json({ message: "Invalid old password." });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                avatarUrl: avatarUrl || user.avatarUrl
                // NOTE: In a real app we'd hash newPassword and save it here
            }
        });

        res.json({ message: 'Profile updated successfully', user: { id: updatedUser.id, username: updatedUser.username, role: updatedUser.role, avatarUrl: updatedUser.avatarUrl } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, username: true, role: true, avatarUrl: true }
        });
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
};
