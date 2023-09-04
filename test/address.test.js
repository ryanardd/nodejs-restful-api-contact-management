import supertest from "supertest";
import { createTestAddress, createTestContact, createTestUser, getTestAddress, getTestContact, removeAllTestAddress, removeAllTestContact, removeTestUser } from "./test-util";
import { web } from "../src/application/web"
import { logger } from "../src/application/logging";

describe('POST /api/contacts/:contactId/addresses', () => {

    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestAddress();
        await removeAllTestContact();
        await removeTestUser();
    });

    it('should can create address', async () => {
        const testContact = await getTestContact()

        const result = await supertest(web)
            .post('/api/contacts/' + testContact.id + '/addresses')
            .set('Authorization', 'test')
            .send({
                street: 'test',
                city: 'Kota test',
                province: 'Provinsi test',
                country: 'indonesia',
                postal_code: '123123',
            });

        logger.info(result.body)

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.street).toBe('test');
        expect(result.body.data.city).toBe('Kota test');
        expect(result.body.data.province).toBe('Provinsi test');
        expect(result.body.data.country).toBe('indonesia');
        expect(result.body.data.postal_code).toBe('123123');

    });


    it('should reject if request data invalid', async () => {
        const testContact = await getTestContact()

        const result = await supertest(web)
            .post('/api/contacts/' + testContact.id + '/addresses')
            .set('Authorization', 'test')
            .send({
                street: '',
                city: 'Kota test',
                province: 'Provinsi test',
                country: '',
                postal_code: '123123',
            });

        logger.info(result.body)

        expect(result.status).toBe(400);

    });

});

describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });

    afterEach(async () => {
        await removeAllTestAddress();
        await removeAllTestContact();
        await removeTestUser();
    });

    it('should can get data address', async () => {

        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .get('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
            .set('Authorization', 'test')

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.street).toBe('Jalan test');
        expect(result.body.data.city).toBe('Kota test');
        expect(result.body.data.province).toBe('Provinsi test');
        expect(result.body.data.country).toBe('Indonesia');
        expect(result.body.data.postal_code).toBe('123123');
    });

    it('should reject if contact id invalid', async () => {

        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .get('/api/contacts/' + (testContact.id + 1) + '/addresses/' + testAddress.id)
            .set('Authorization', 'test')

        expect(result.status).toBe(404);
    });

    it('should reject if address id invalid', async () => {

        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .get('/api/contacts/' + testContact.id + '/addresses/' + (testAddress.id + 1))
            .set('Authorization', 'test')

        expect(result.status).toBe(404);
    });
});

describe('PUT /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });

    afterEach(async () => {
        await removeAllTestAddress();
        await removeAllTestContact();
        await removeTestUser();
    });

    it('should can update data address', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .put('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
            .set('Authorization', 'test')
            .send({
                street: 'street',
                city: 'city',
                province: 'province',
                country: 'country',
                postal_code: 'postalcode'
            })

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.street).toBe('street');
        expect(result.body.data.city).toBe('city');
        expect(result.body.data.province).toBe('province');
        expect(result.body.data.country).toBe('country');
        expect(result.body.data.postal_code).toBe('postalcode');
    });

    it('should reject if contact id invalid', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .put('/api/contacts/' + (testContact.id + 1) + '/addresses/' + testAddress.id)
            .set('Authorization', 'test')
            .send({
                street: 'street',
                city: 'city',
                province: 'province',
                country: 'country',
                postal_code: 'postalcode'
            })

        expect(result.status).toBe(404);
    });

    it('should reject if address id invalid', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .put('/api/contacts/' + testContact.id + '/addresses/' + (testAddress.id + 1))
            .set('Authorization', 'test')
            .send({
                street: 'street',
                city: 'city',
                province: 'province',
                country: 'country',
                postal_code: 'postalcode'
            })

        expect(result.status).toBe(404);
    });

    it('should reject if request invalid', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .put('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
            .set('Authorization', 'test')
            .send({
                street: 'street',
                city: 'city',
                province: 'province',
                country: '',
                postal_code: ''
            })

        expect(result.status).toBe(400);
    });
});