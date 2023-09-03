import supertest from "supertest";
import { createTestContact, createTestUser, getTestContact, removeAllTestAddress, removeAllTestContact, removeTestUser } from "./test-util";
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

});