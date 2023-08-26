import userService from "../service/user-service"

/**
 * Mekanisme
 */


const register = async (req, res, next) => {

    try {
        // get data
        const result = await userService.register(req.body);

        // response
        res.status(200).json({
            data: result
        });
    } catch (error) {
        next(error)
    }

}

const login = async (req, res, next) => {
    try {
        // get data
        const result = await userService.login(req.body);

        // response
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error);
    }
}

export default {
    register,
    login
}