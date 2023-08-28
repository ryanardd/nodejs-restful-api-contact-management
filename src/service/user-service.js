import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { getUserValidation, loginUserValidation, registerUserValidation, updateUserValidation } from "../validation/user-validation"
import { validate } from "../validation/validation"
import bcrypt from "bcrypt";
import { v4 as uuid } from 'uuid';


/**
 * Logic Bussiness
 */

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    // cek jika user sudah tervalidasi
    const countUser = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });

    if (countUser === 1) {
        throw new ResponseError(400, "username already exist");
    }

    // lakukan hashing password
    user.password = await bcrypt.hash(user.password, 10);

    // jika user belum tervalidasi, maka create
    return prismaClient.user.create({
        data: user,
        select: {
            username: true,
            name: true
        }
    });

}


const login = async (request) => {
    // lakukan validation request
    const loginRequest = validate(loginUserValidation, request);

    // cek database
    const user = await prismaClient.user.findUnique({
        where: {
            username: loginRequest.username
        },
        select: {
            username: true,
            password: true
        }
    })

    // cek login
    if (!user) {
        throw new ResponseError(401, 'username or password wrong')
    }

    // compare password
    const isPasswordValidation = await bcrypt.compare(loginRequest.password, user.password);
    if (!isPasswordValidation) {
        throw new ResponseError(401, 'username or password wrong');
    }

    // create token when login success
    const token = uuid().toString()

    // update db cause the token has been created
    return prismaClient.user.update({
        data: {
            token: token
        },
        where: {
            username: user.username
        },
        select: {
            token: true
        }
    });

}

const get = async (username) => {

    // lakukan validation
    const getUsername = validate(getUserValidation, username);

    // cek database 
    const user = await prismaClient.user.findUnique({
        where: {
            username: getUsername
        },
        select: {
            username: true,
            name: true
        }
    });

    // cek username
    if (!user) {
        throw new ResponseError(404, 'user is not found');
    }

    // jika username ada maka kembalikan
    return user;

}

const update = async (request) => {

    // lakukan validation
    const user = validate(updateUserValidation, request);

    // cek adanya user dalam db
    const userCount = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });

    // cek user jika tidak ada
    if (userCount !== 1) {
        throw new ResponseError(404, 'Username is not found');
    }

    // cek user jika ada
    const data = {}
    if (user.name) {
        data.name = user.name
    }

    if (user.password) {
        data.password = await bcrypt.hash(user.password, 10);
    }

    // lakukan update
    return prismaClient.user.update({
        where: {
            username: user.username
        },
        data: data,
        select: {
            username: true,
            name: true
        }
    });

}

const logout = async (request) => {

    // lakukan validation
    const userRequest = validate(getUserValidation, request);

    // cek database
    const user = await prismaClient.user.findUnique({
        where: {
            username: userRequest
        }
    });

    if (!user) {
        throw new ResponseError(404, 'Username is not found');
    }

    return prismaClient.user.update({

        where: {
            username: userRequest
        },
        data: {
            token: null
        },
        select: {
            username: true
        }
    })
}

export default {
    register,
    login,
    get,
    update,
    logout
}