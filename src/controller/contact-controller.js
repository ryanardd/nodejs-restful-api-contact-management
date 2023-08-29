import contactService from "../service/contact-service";

const create = async (req, res, next) => {
    try {

        // mendefinisikan user dan request berdasarkan dari method contact-service
        const user = req.user;
        const request = req.body;

        const result = await contactService.create(user, request);
        res.status(200).json({
            data: result
        })

    } catch (error) {
        next(error);
    }
}

const get = async (req, res, next) => {
    try {

        // mendefinisikan user dan request berdasarkan dari method contact-service
        const user = req.user // optional
        const request = req.params.contactId

        const result = await contactService.get(user, request);
        res.status(200).json({
            data: result
        })

    } catch (error) {
        next(error);
    }
}

export default {
    create,
    get
}