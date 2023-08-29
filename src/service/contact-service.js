import { createContactValidation } from "../validation/contact-validation";
import { validate } from "../validation/validation";
import { prismaClient } from "../application/database";

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

export default {
    create
}