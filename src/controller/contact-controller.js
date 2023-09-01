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

const remove = async (req, res, next) => {

    try {
        const user = req.user // diambil dari middleware
        const request = req.params.contactId // diambil dari params url

        await contactService.remove(user, request);
        res.status(200).json({
            data: 'OK'
        });
    } catch (error) {
        next(error);
    }

}

const search = async (req, res, next) => {

    try {
        const user = req.user // get of middleware
        const request = {
            name: req.query.name,
            email: req.query.email,
            phone: req.query.phone,
            page: req.query.page,
            size: req.query.size
        }

        const result = await contactService.search(user, request);
        res.status(200).json({
            data: result.data,
            paging: result.paging
        })
    } catch (error) {
        next(error)
    }

}

export default {
    create,
    get,
    update,
    remove,
    search
}