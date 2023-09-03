import { createAddressValidation } from "../validation/address-validation";
import { getContactValidation } from "../validation/contact-validation";
import { validate } from "../validation/validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";

const create = async (user, contactId, request) => {
    // lakukan validation data contact
    contactId = validate(getContactValidation, contactId);

    // check to database data id contact
    const countTotalContact = await prismaClient.contact.count({
        where: {
            username_id: user.username,
            id: contactId
        }
    });

    // jika id contact tidak ada
    if (countTotalContact !== 1) {
        throw new ResponseError(404, 'contact is not found');
    }

    // setelah itu
    // lakukan validation data address
    const address = validate(createAddressValidation, request);
    address.contact_id = contactId

    // lalu create atau kembalikan data
    return prismaClient.address.create({
        data: address,
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true
        }
    });

}

export default {
    create
}