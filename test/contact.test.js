
import supertest from "supertest";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";
import { createManyTestContact, createTestContact, createTestUser, getTestContact, removeAllTestContact, removeTestUser } from "./test-util";


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

describe('DELETE /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestContact();
        await removeTestUser();
    });

    it('should can remove data contact', async () => {
        let testContact = await getTestContact();

        const result = await supertest(web)
            .delete('/api/contacts/' + testContact.id)
            .set('Authorization', 'test')

        logger.info(result.body)

        expect(result.status).toBe(200);
        expect(result.body.data).toBe('OK');

        testContact = await getTestContact();

        expect(testContact).toBeNull();
    });

    it('should reject if request remove data contact invalid', async () => {
        let testContact = await getTestContact();

        const result = await supertest(web)
            .delete('/api/contacts/' + (testContact.id + 1))
            .set('Authorization', 'test')

        logger.info(result.body)

        expect(result.status).toBe(404);
    });
});


// ERORR 
describe('SEARCH /api/contacts', () => {

    beforeEach(async () => {
        await createTestUser();
        await createManyTestContact();
    });

    afterEach(async () => {
        await removeAllTestContact();
        await removeTestUser();
    });

    it('should can search without params', async () => {
        const result = await supertest(web)
            .get('/api/contacts/')
            .set('Authorization', 'test')

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(10);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_item).toBe(15);

    });

    it('should can search to page 2', async () => {
        const result = await supertest(web)
            .get('/api/contacts/')
            .query(
                {
                    page: 2
                }
            )
            .set('Authorization', 'test')

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(5);
        expect(result.body.paging.page).toBe(2);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_item).toBe(15);
    });

    it('should can search using name', async () => {
        const result = await supertest(web)
            .get('/api/contacts/')
            .query(
                {
                    name: 'test 13'
                }
            )
            .set('Authorization', 'test')

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(1);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(1);
    });

    it('should can search using email', async () => {
        const result = await supertest(web)
            .get('/api/contacts/')
            .query(
                {
                    email: 'test13'
                }
            )
            .set('Authorization', 'test')

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(1);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(1);
    });

    it('should can search using phone', async () => {
        const result = await supertest(web)
            .get('/api/contacts/')
            .query(
                {
                    phone: '1234568902'
                }
            )
            .set('Authorization', 'test')

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(1);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(1);
    });

});