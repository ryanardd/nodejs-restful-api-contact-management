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

export const removeAllTestContact = async () => {
    return prismaClient.contact.deleteMany({
        where: {
            username_id: 'test'
        }
    })
}

export const createTestContact = async () => {
    return prismaClient.contact.create({
        data: {
            username_id: 'test',
            first_name: 'test',
            last_name: 'test',
            email: 'test@gmail.com',
            phone: '123456890'
        }
    })
}

export const getTestContact = async () => {
    return prismaClient.contact.findFirst({
        where: {
            username_id: 'test'
        }
    })
}