import { createContactValidation, getContactValidation } from "../validation/contact-validation";
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
            username_id: user.username_id, // foreign key
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

export default {
    create,
    get
}