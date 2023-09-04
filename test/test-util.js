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

export const createManyTestContact = async () => {
    for (let i = 0; i < 15; i++) {
        await prismaClient.contact.create({
            data: {
                username_id: 'test',
                first_name: `test ${i}`,
                last_name: `test ${i}`,
                email: `test${i}@gmail.com`,
                phone: `123456890${i}`
            }
        })
    }
}

export const getTestContact = async () => {
    return prismaClient.contact.findFirst({
        where: {
            username_id: 'test'
        }
    })
}

export const removeAllTestAddress = async () => {
    return prismaClient.address.deleteMany({
        where: {
            contact: {
                username_id: 'test',
            }
        }
    })
}

export const createTestAddress = async () => {
    const contact = await getTestContact();
    return prismaClient.address.create({
        data: {
            contact_id: contact.id,
            street: 'Jalan test',
            city: 'Kota test',
            province: 'Provinsi test',
            country: 'Indonesia',
            postal_code: '123123'
        }
    })
}

export const getTestAddress = async () => {
    return prismaClient.address.findFirst({
        where: {
            contact: {
                username_id: 'test'
            }
        }
    })
}