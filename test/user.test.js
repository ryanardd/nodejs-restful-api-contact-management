import supertest from "supertest";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";
import { createManyTestContact, createTestContact, createTestUser, getTestContact, getUserTest, removeAllTestContact, removeAllTestUser, removeTestUser } from "./test-util";
import bcrypt from "bcrypt";

describe('POST /api/users', () => {

    // jika selesai melakukan test, maka hapus
    afterEach(async () => {
        await removeTestUser();
    })

    it('should can register new users', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: 'test',
                password: "rahasia",
                name: "test"
            });

        console.info(result.body);

        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe("test")
        expect(result.body.data.name).toBe("test")
        expect(result.body.data.password).toBeUndefined();
    });


    it('should reject if request is invalid', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: '',
                password: "",
                name: ""
            });

        logger.info(result.body)

        expect(result.status).toBe(400)
        expect(result.body.errors).toBeDefined()
    });

});

describe('POST /api/users/login', () => {

    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can login', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'test',
                password: "rahasia"
            });

        logger.info(result.body)

        expect(result.status).toBe(200);
        expect(result.body.data.token).toBeDefined();
        expect(result.body.data.token).not.toBe('test');
    });

    it('should reject login if request invalid', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: '',
                password: ''
            });

        logger.info(result.body)

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject login if password is wrong', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'test',
                password: 'salah'
            });

        logger.info(result.body)

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject login if username is wrong', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'salah',
                password: 'rahasia'
            });

        logger.info(result.body)

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });

});

describe('GET /api/users/current', () => {

    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can get user', async () => {
        const result = await supertest(web)
            .get('/api/users/current')
            .set('Authorization', 'test');

        logger.info(result.body)

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test');
        expect(result.body.data.name).toBe('test');
    });

    it('should reject if data invalid', async () => {
        const result = await supertest(web)
            .get('/api/users/current')
            .set('Authorization', 'salah');

        logger.info(result.body)

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });

})

describe('PATCH /api/users/current', () => {

    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can update user', async () => {

        const result = await supertest(web)
            .patch('/api/users/current')
            .set('Authorization', 'test')
            .send({
                name: 'bejo',
                password: 'bejo'
            })

        logger.info(result.body)
        // expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test');
        expect(result.body.data.name).toBe('bejo');

        const user = await getUserTest();
        expect(await bcrypt.compare('bejo', user.password)).toBe(true);

    });

    it('should can update name', async () => {

        const result = await supertest(web)
            .patch('/api/users/current')
            .set('Authorization', 'test')
            .send({
                name: 'beji',
            })

        logger.info(result.body)
        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test');
        expect(result.body.data.name).toBe('beji');

    });

    it('should can update password', async () => {

        const result = await supertest(web)
            .patch('/api/users/current')
            .set('Authorization', 'test')
            .send({
                password: 'bejo'
            })

        logger.info(result.body)
        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('test');

        const user = await getUserTest();
        expect(await bcrypt.compare('bejo', user.password)).toBe(true);

    });

    it('should reject if update user invalid', async () => {

        const result = await supertest(web)
            .patch('/api/users/current')
            .set('Authorization', 'salah')
            .send({})

        logger.info(result.body)
        expect(result.status).toBe(401);

    });

});

describe('DELETE /api/users/logout', () => {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can logout', async () => {
        const result = await supertest(web)
            .delete('/api/users/logout')
            .set('Authorization', 'test')

        expect(result.status).toBe(200)
        expect(result.body.data).toBe("OK")

        const user = await getUserTest();
        expect(user.token).toBeNull()
    });

    it('should reject if data invalid', async () => {
        const result = await supertest(web)
            .delete('/api/users/logout')
            .set('Authorization', 'salah')

        expect(result.status).toBe(401)
    });

});