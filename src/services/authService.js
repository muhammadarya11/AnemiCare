import { PrismaClient } from '@prisma/client';
import Hash from '../utils/hash.js';

const prisma = new PrismaClient();

export const registerUser = async (name, username, password) => {

    // Check user already registered?
    const user = await prisma.dokter.findUnique({
        where: {
            username: username
        }
    });

    if (user) {
        return null;
    }

    const hashPassword = Hash.make(password);

    const newUser = await prisma.dokter.create({
        data: {
            name: name,
            username: username,
            password: hashPassword
        }, select: {
            name: true,
            username: true
        }
    });

    return newUser;
};

export const loginUser = async (username, password) => {

    const user = await prisma.dokter.findUnique({
        where: {
            username: username
        }
    });

    if (!user) {
        return null;
    } else if (!Hash.check(password, user.password)) {
        return null;
    }

    return user;
};