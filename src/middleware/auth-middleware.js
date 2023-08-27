import { prismaClient } from "../application/database";

// digunakan untuk auth ketika sudah ada user
export const authMiddleware = async (req, res, next) => {
    // get value headers HTTP authorization (ada 2 cara)
    // const token = req.get('Authorization');
    const token = req.headers.authorization;

    // cek token 
    if (!token) {
        res.status(401).json({
            errors: "Unauthorization"
        }).end();
    } else {
        // get db
        const user = await prismaClient.user.findFirst({
            where: {
                token: token
            }
        });

        // cek user
        if (!user) {
            res.status(401).json({
                errors: "Unauthorization"
            });
        } else {
            req.user = user;
            next();
        }
    }
}