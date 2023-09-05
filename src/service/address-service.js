import { createAddressValidation, getAddressValidation, updateAddressValidation } from "../validation/address-validation";
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

    // ambil id contact berdasarkan validation contactId
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

const get = async (user, contactId, addressId) => {
    // lakukan validation data contact
    contactId = validate(getContactValidation, contactId);

    // cek db contact id
    const countTotalContact = await prismaClient.contact.count({
        where: {
            username_id: user.username
        }
    });

    // jika contact id tidak ada
    if (countTotalContact !== 1) {
        throw new ResponseError(404, 'contact is not found');
    }

    // setelah itu
    // lakukan validation address
    addressId = validate(getAddressValidation, addressId);

    // cek database address id
    const address = await prismaClient.address.findFirst({
        where: {
            contact_id: contactId,
            id: addressId
        },
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true
        }
    });

    // cek jika data address tidak ada
    if (!address) {
        throw new ResponseError(404, 'Address is not found');
    }

    // jika ada maka kembalikan
    return address;
}

const update = async (user, contactId, address) => {
    // lakukan validation contact id
    contactId = validate(getContactValidation, contactId);

    // cek database contact id
    const countTotalContact = await prismaClient.contact.count({
        where: {
            username_id: user.username
        }
    });

    if (countTotalContact !== 1) {
        throw new ResponseError(404, 'contact id is not found');
    }

    // lakukan validation address update
    address = validate(updateAddressValidation, address);

    // cek database address
    const countTotalAddress = await prismaClient.address.count({
        where: {
            contact_id: contactId,
            id: address.id
        }
    });

    if (countTotalAddress !== 1) {
        throw new ResponseError(404, 'address id is not found');
    }

    // jika ada data address maka kembalikan
    return prismaClient.address.update({
        where: {
            id: address.id
        },
        data: {
            street: address.street,
            city: address.city,
            province: address.province,
            country: address.country,
            postal_code: address.postal_code
        },
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true
        }
    })

}

const remove = async (user, contactId, addressId) => {
    // validation data contact id
    contactId = validate(getContactValidation, contactId);

    // pastikan data di db
    const countTotalContact = await prismaClient.contact.count({
        where: {
            username_id: user.username
        }
    });

    // jika data tidak ada
    if (countTotalContact !== 1) {
        throw new ResponseError(404, 'contact is not found');
    }

    // next
    // validation data address id
    addressId = validate(getAddressValidation, addressId);

    // pastikan data address ada di db
    const countTotalAddress = await prismaClient.address.count({
        where: {
            contact_id: contactId,
            id: addressId
        }
    });

    // jika tidak ada
    if (countTotalAddress !== 1) {
        throw new ResponseError(404, 'address is not found');
    }

    return prismaClient.address.delete({
        where: {
            id: addressId
        }
    });
}

export default {
    create,
    get,
    update,
    remove
}