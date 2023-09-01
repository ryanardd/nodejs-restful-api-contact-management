import { createContactValidation, getContactValidation, searchContactValidation, updateContactValidation } from "../validation/contact-validation";
import { validate } from "../validation/validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";

const create = async (user, request) => {

    // lakkukan validation
    const contact = validate(createContactValidation, request);

    // description contact.username_id berdasarkan relation user.username
    contact.username_id = user.username

    // create data when get data
    return prismaClient.contact.create({
        data: contact,
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true
        }
    })

}

const get = async (user, contactId) => {

    // lakukan validation berdasarkan request client contactId
    contactId = validate(getContactValidation, contactId)

    // get contact data berdasarkan id yang tersedia di db
    const contact = await prismaClient.contact.findFirst({
        where: {
            username_id: user.username, // foreign key
            id: contactId, // id berdasarkan request validate
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true
        }
    })

    // check if contact not found
    if (!contact) {
        throw new ResponseError(404, 'Conctact is not found');
    }

    // contact true
    return contact;

}

const update = async (user, request) => {

    // lakukan validation
    const contact = validate(updateContactValidation, request)

    // cek data di db
    const countContactInDatabase = await prismaClient.contact.count({
        where: {
            username_id: user.username,
            id: contact.id
        },
    });

    // jika tidak ada data
    if (countContactInDatabase !== 1) {
        throw new ResponseError(404, 'data is not found');
    }

    // jika ada maka kembalikan
    return prismaClient.contact.update({
        where: {
            id: contact.id
        },
        data: {
            first_name: contact.first_name,
            last_name: contact.last_name,
            email: contact.email,
            phone: contact.phone
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true
        }
    })

}

const remove = async (user, request) => {

    // lakukan validation
    request = validate(getContactValidation, request);

    // cek data di db
    const countInDatabase = await prismaClient.contact.count({
        where: {
            username_id: user.username,
            id: request
        }
    });

    // jika tidak ada
    if (countInDatabase !== 1) {
        throw new ResponseError(404, 'contact is not found');
    }

    // jika ada maka kembalikan
    return prismaClient.contact.delete({
        where: {
            id: request
        }
    })

}

const search = async (user, request) => {

    // lakukan validation
    request = await validate(searchContactValidation, request);

    // jika page 1, ((page - 1)*size) = 0
    // jika page 2, ((page - 1)*size) = 10
    const skip = (request.page - 1) * request.size;

    // untuk memfilter request pencarian
    const filters = []

    // filter harus memiliki user

    filters.push({
        username_id: user.username_id
    })

    if (filters.name) {
        filters.push({
            OR: [
                {
                    first_name: {
                        contains: request.name
                    }
                },
                {
                    last_name: {
                        contains: request.name
                    }
                }
            ]
        })
    }
    if (filters.email) {
        filters.push({
            email: {
                contains: request.email
            }
        })
    }
    if (filters.phone) {
        filters.push({
            phone: {
                contains: request.phone
            }
        })
    }

    // skenario pencarian
    const contacts = await prismaClient.contact.findMany({
        where: {
            AND: filters
        },
        take: request.size,
        skip: skip
    });

    // cek data di db
    const totalItems = await prismaClient.contact.count({
        where: {
            AND: filters
        }
    });

    // jika ada maka kembalikan
    return {
        data: contacts,
        pagging: {
            page: request.page,
            total_item: totalItems,
            total_page: Math.ceil(totalItems / request.size)
        }
    }
}

export default {
    create,
    get,
    update,
    remove,
    search
}