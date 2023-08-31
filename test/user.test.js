import supertest from "supertest";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";
import { createTestContact, createTestUser, getTestContact, getUserTest, removeAllTestContact, removeAllTestUser, removeTestUser } from "./test-util";
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

describe('POST /api/contacts', () => {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeAllTestContact();
        await removeTestUser();
    });

    it('should can create contact', async () => {

        const result = await supertest(web)
            .post('/api/contacts')
            .set('Authorization', 'test')
            .send({
                first_name: 'test',
                last_name: 'test',
                email: 'test@gmail.com',
                phone: '08523232323',
            })

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.first_name).toBe('test');
        expect(result.body.data.last_name).toBe('test');
        expect(result.body.data.email).toBe('test@gmail.com');
        expect(result.body.data.phone).toBe('08523232323');

    });

    it('should reject if contact data invalid', async () => {

        const result = await supertest(web)
            .post('/api/contacts')
            .set('Authorization', 'test')
            .send({
                first_name: '',
                last_name: 'test',
                email: 'test@gmail.com',
                phone: '08523232323',
            })

        logger.info(result.body)

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeUndefined;

    });
});

describe('GET /api/contact/:contactId', () => {

    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestContact();
        await removeTestUser();
    });

    it('should can get contact', async () => {

        const contactId = await getTestContact();

        const result = await supertest(web)
            .get('/api/contacts/' + contactId.id)
            .set('Authorization', 'test')

        logger.info(result);

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(contactId.id);
        expect(result.body.data.first_name).toBe(contactId.first_name);
        expect(result.body.data.last_name).toBe(contactId.last_name);
        expect(result.body.data.email).toBe(contactId.email);
        expect(result.body.data.phone).toBe(contactId.phone);
    });

    it('should reject if get contact invalid', async () => {

        const contactId = await getTestContact();

        const result = await supertest(web)
            .get('/api/contacts/' + (contactId.id + 1))
            .set('Authorization', 'test')

        logger.info(result);

        expect(result.status).toBe(404);
    });

});

describe('PUT /api/contacts/:contactId', () => {

    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestContact();
        await removeTestUser();
    });

    it('should can update data contact', async () => {
        // get data test
        const testContact = await getTestContact();

        const result = await supertest(web)
            .put('/api/contacts/' + testContact.id)
            .set('Authorization', 'test')
            .send({
                first_name: 'bejo',
                last_name: "berbakti",
                email: "bejo@gmail.com",
                phone: '099999999'
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(testContact.id);
        expect(result.body.data.first_name).toBe('bejo');
        expect(result.body.data.last_name).toBe('berbakti');
        expect(result.body.data.email).toBe('bejo@gmail.com');
        expect(result.body.data.phone).toBe('099999999');
    });

    it('should reject if request invalid', async () => {
        // get data test
        const testContact = await getTestContact();

        const result = await supertest(web)
            .put('/api/contacts/' + testContact.id)
            .set('Authorization', 'test')
            .send({
                first_name: '',
                last_name: "",
                email: "bejo",
                phone: '099999999'
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
    });

    it('should reject if data not found', async () => {
        // get data test
        const testContact = await getTestContact();

        const result = await supertest(web)
            .put('/api/contacts/' + (testContact.id + 1))
            .set('Authorization', 'test')
            .send({
                first_name: 'bejo',
                last_name: "berbakti",
                email: "bejo@gmail.com",
                phone: '099999999'
            });

        logger.info(result.body);

        expect(result.status).toBe(404);
    });

});