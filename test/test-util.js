import { prismaClient } from "../src/application/database"
import bcrypt from "bcrypt";

export const removeTestUser = async () => {
    await prismaClient.user.deleteMany({
        where: {
            username: 'test'
        }
    })
}

export const createTestUser = async () => {
    await prismaClient.user.create({
        data: {
            username: 'test',
            password: await bcrypt.hash('rahasia', 10),
            name: 'test',
            token: 'test'
        }
    })
}

export const getUserTest = async () => {
    return prismaClient.user.findUnique({
        where: {
            username: "test"
        }
    })
}

export const removeAllTestUser = async () => {
    return prismaClient.contact.deleteMany({
        where: {
            username_id: 'test'
        }
    })
}