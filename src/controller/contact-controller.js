import contactService from "../service/contact-service";

const create = async (req, res, next) => {
    try {

        // mendefinisikan user dan request berdasarkan dari contact-service
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

        // mendefinisikan user dan request berdasarkan dari contact-service
        const user = req.user // optional // diambil dari middleware
        const request = req.params.contactId // diambil dari params url

        const result = await contactService.get(user, request);
        res.status(200).json({
            data: result
        })

    } catch (error) {
        next(error);
    }
}

const update = async (req, res, next) => {

    try {

        // mendefinisikan user dan request berdasarkan dari contact-service
        const user = req.user; // diambil dari middleware
        const contactId = req.params.contactId; // diambil dari params url
        const request = req.body;
        request.id = contactId;

        const result = await contactService.update(user, request);
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