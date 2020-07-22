const User = require('./../models/User');
const wish = require('wish');
const app = require('./../server');
const request = require('supertest');

const URL = '/graphql';

beforeEach(function () {
    this.timeout(0);
    return User.deleteMany({}).then(() => {
        var p1 = User.create({ name: 'Toñito' });
        var p2 = User.create({ name: 'Juanito', teams: [{ name: 'Real Madrid', country: 'España' }] });
        return Promise.all([p1, p2]);
    });
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
            .send({ query })
            .expect(200)
            .expect(res => {
                var user = res.body.data.addUser;
                wish(user._id !== undefined);
                wish(user.name === "Muñiz");
            })
            .end(done);
    });

    it('should not create a null user', (done) => {
        const query = `
            mutation 
            {
                addUser(user: { name: "" })
                { _id, name }
            }
        `;
        request(app)
            .post(URL)
            .send({ query })
            .expect(200)
            .end(done);
    });

    it('should get a user with only name', (done) => {
        const query = `{
            getUser(name: "Toñito")
            { name }
        }
        `;
        request(app)
            .post(URL)
            .send({ query })
            .expect(200)
            .expect(res => {
                var user = res.body.data.getUser;
                wish(user.name === "Toñito");
                wish(user.teams === undefined)
            })
            .end(done);
    });

    it('should get a user with his teams', (done) => {
        const query = `{
            getUser(name: "Juanito")
            { 
                name, 
                teams {
                    name,
                    country
                }
            }
        }
        `;
        request(app)
            .post(URL)
            .send({ query })
            .expect(200)
            .expect(res => {
                var user = res.body.data.getUser;
                wish(user.name === "Juanito");
                wish(user.teams.length === 1);
                wish(user.teams[0].name === 'Real Madrid');
                wish(user.teams[0].country === 'España');
            })
            .end(done);
    });

    it('should get all users', (done) => {
        const query = `{
            users
            { 
                name
            }
        }
        `;
        request(app)
            .post(URL)
            .send({ query })
            .expect(200)
            .expect(res => {
                var users = res.body.data.users;
                wish(users.length === 2);
                wish(users[0].name === 'Toñito');
                wish(users[1].name === 'Juanito');
            })
            .end(done);
    });

    it('should add a team to a user', (done) => {
        const query = `mutation
        {
            addTeamToUser(user: {name: "Toñito"}, team: {name: "Getafe", country: "España"})
            { 
                name, 
                teams {
                    name,
                    country
                }
            }
        }
        `;
        request(app)
            .post(URL)
            .send({ query })
            .expect(200)
            .expect(res => {
                var user = res.body.data.addTeamToUser;
                wish(user.name === "Toñito");
                wish(user.teams.length === 1);
                wish(user.teams[0].name === 'Getafe');
                wish(user.teams[0].country === 'España');
            })
            .end(done);
    });

    it('should not add an existent team to a user', (done) => {
        const query = `mutation
        {
            addTeamToUser(user: {name: "Juanito"}, team: {name: "Real Madrid", country: "España"})
            { 
                name, 
                teams {
                    name,
                    country
                }
            }
        }
        `;
        request(app)
            .post(URL)
            .send({ query })
            .expect(200)
            .expect(res => {
                var user = res.body.data.addTeamToUser;
                wish(user.name === "Juanito");
                wish(user.teams.length === 1);
            })
            .end(done);
    });
});
