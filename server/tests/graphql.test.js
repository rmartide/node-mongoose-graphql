const User = require('./../models/User');
const wish = require('wish');
const app = require('./../server');
const request = require('supertest');

const URL = '/graphql';

beforeEach(() => {
    User.deleteMany({});
})

describe('graphql operations', () => {

    it('should create a user', (done) => {
        const query = `
            mutation 
            {
                addUser(user: { name: "Muñiz" })
                { _id, name }
            }
        `;
        request(app)
            .post(URL)
            .send({query})
            .expect(200)
            .expect(res => {
                var user = res.body.data.addUser;
                wish(user._id !== undefined);
                wish(user.name === "Muñiz");
            })
            .end(done);
    });

})
