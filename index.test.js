const request = require('supertest');
// express app
const app = require('./index');

// db setup
const { sequelize, Dog } = require('./db');
const seed = require('./db/seedFn');
const {dogs} = require('./db/seedData');

describe('Endpoints', () => {
    // to be used in POST test
    const testDogData = {
        breed: 'Poodle',
        name: 'Sasha',
        color: 'black',
        description: 'Sasha is a beautiful black pooodle mix.  She is a great companion for her family.'
    };

    beforeAll(async () => {
        // rebuild db before the test suite runs
        await seed();
    });

    describe('GET /dogs', () => {
        it('should return list of dogs with correct data', async () => {
            // make a request
            const response = await request(app).get('/dogs');
            // assert a response code
            expect(response.status).toBe(200);
            // expect a response
            expect(response.body).toBeDefined();
            // toEqual checks deep equality in objects
            expect(response.body[0]).toEqual(expect.objectContaining(dogs[0]));
        });
    });

    describe('POST /dogs', () => {
        it('should add a dog to the the database', async() => {
            // make a request
            const response = await request(app).post('/dogs').send(testDogData)
            // asser a response code
            expect(response.statusCode).toBe(200)
            // expect a response 
            expect(response.body).toBeDefined()
            // check that we get an instance of dog
            expect(response.body).toEqual(expect.objectContaining(testDogData))
        })

        it('Query the db to ensure data is correct', async() => {
            // query the data with the id provided by the test above
            const dog = await Dog.findOne({
                where: {
                    id: 6
                }
            })
            // check that first and formost the data coming back is an instance of the model
            expect(dog).toBeInstanceOf(Dog)
            // verify that the queried data matches the test data provided
            expect(dog).toEqual(expect.objectContaining(testDogData))
        })
    })

    describe('DELETE /dogs', ()=> {
        it('should delete a dog from the db', async() => {
            const response = await request(app).delete('/dogs/1')

            const deletedDog = await Dog.findAll({
                where: {
                    id: 1
                }
            })

            // assert a response code
            expect(response.statusCode).toBe(200)
            // expect dog with id of 1 to be removed
            expect(deletedDog[0]).toBeUndefined()

        })
    })
});