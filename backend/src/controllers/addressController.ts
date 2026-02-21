import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

// Get all addresses for a user
export const getAddresses = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const addresses = await prisma.address.findMany({
            where: { userId },
            orderBy: [
                { isDefault: 'desc' },
                { createdAt: 'desc' }
            ]
        });

        res.json(addresses);
    } catch (error) {
        console.error("Error fetching addresses:", error);
        res.status(500).json({ message: 'Error fetching addresses' });
    }
};

// Add a new address
export const addAddress = async (req: Request, res: Response) => {
    try {
        const { userId, fullName, street, city, state, zipCode, country, isDefault } = req.body;

        if (!userId || !fullName || !street || !city || !state || !zipCode) {
            return res.status(400).json({ message: 'Missing required address fields' });
        }

        // If this new address is set to default, unset any existing default for this user
        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false }
            });
        }

        // If it's the user's first address, force it to be default
        const existingAddressCount = await prisma.address.count({ where: { userId } });
        const finalIsDefault = existingAddressCount === 0 ? true : Boolean(isDefault);

        const newAddress = await prisma.address.create({
            data: {
                userId,
                fullName,
                street,
                city,
                state,
                zipCode,
                country: country || "US",
                isDefault: finalIsDefault
            }
        });

        res.status(201).json(newAddress);
    } catch (error) {
        console.error("Error creating address:", error);
        res.status(500).json({ message: 'Error creating address' });
    }
};

// Set an address as default
export const setDefaultAddress = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Unset old defaults
        await prisma.address.updateMany({
            where: { userId, isDefault: true },
            data: { isDefault: false }
        });

        // Set the new default
        const updatedAddress = await prisma.address.update({
            where: { id },
            data: { isDefault: true }
        });

        res.json(updatedAddress);
    } catch (error) {
        console.error("Error setting default address:", error);
        res.status(500).json({ message: 'Error updating address' });
    }
};

// Delete an address
export const deleteAddress = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.address.delete({
            where: { id }
        });

        res.status(204).send();
    } catch (error) {
        console.error("Error deleting address:", error);
        res.status(500).json({ message: 'Error deleting address' });
    }
};
