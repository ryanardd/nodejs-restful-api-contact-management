import addressService from "../service/address-service";

const create = async (req, res, next) => {
    try {

        const user = req.user;
        const request = req.body
        const contactId = req.params.contactId;

        const result = await addressService.create(user, contactId, request);
        res.status(200).json({
            data: result
        })

    } catch (error) {
        next(error)
    }
}

const get = async (req, res, next) => {
    try {

        const user = req.user;
        const contactId = req.params.contactId;
        const addressId = req.params.addressId;

        const result = await addressService.get(user, contactId, addressId);
        res.status(200).json({
            data: result
        })


    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {

    try {

        const user = req.user;
        const contactId = req.params.contactId;
        const addressId = req.params.addressId;
        const address = req.body
        address.id = addressId

        const result = await addressService.update(user, contactId, address);
        res.status(200).json({
            data: result
        })

    } catch (error) {
        next(error);
    }

}

export default {
    create,
    get,
    update
}