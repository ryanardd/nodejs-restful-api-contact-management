import supertest from "supertest";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";
import { createTestUser, removeTestUser } from "./test-util";

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