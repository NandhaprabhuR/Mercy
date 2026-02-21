import { PrismaClient } from '@prisma/client';
// PrismaClient import is valid. If TS lints it, please restart the TS server via VSCode command palette.

// Prevent multiple instances of Prisma Client in development
declare global {
    var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
