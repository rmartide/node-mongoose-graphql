const { GraphQLSchema, GraphQLObjectType, GraphQLInputObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLList } = require('graphql');
const User = require('./../models/User');
const mongoose = require('mongoose');

var TeamObjectType = new GraphQLObjectType({
    name: 'team',
    fields: {
        name: {
            type: GraphQLString
        },
        country: {
            type: GraphQLString
        }
    }
})

var TeamInputObjectType = new GraphQLInputObjectType({
    name: 'teamInput',
    fields: {
        name: {
            type: GraphQLString
        },
        country: {
            type: GraphQLString
        }
    }
})

var UserObjectType = new GraphQLObjectType({
    name: 'user',
    fields: {
        _id: {
            type: GraphQLString,
            resolve({ _id }) {
                return _id.toHexString();
            }
        },
        name: {
            type: GraphQLString
        },
        teams: {
            type: new GraphQLList(TeamObjectType)
        }
    }
});

var UserInputObjectType = new GraphQLInputObjectType({
    name: 'userInput',
    fields: {
        _id: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        }
    }
})

var schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
            getUser: {
                type: UserObjectType,
                args: {
                    name: {
                        type: GraphQLString,
                    },
                },
                resolve(root, { name }) {
                    return User.findOne({ name });
                }
            },
            users: {
                type: new GraphQLList(UserObjectType),
                resolve() {
                    return User.find({});
                }
            }
        }
    }),
    mutation: new GraphQLObjectType({
        name: 'RootMutationType',
        fields: {
            addUser: {
                type: UserObjectType,
                args: {
                    user: {
                        type: UserInputObjectType
                    }
                },
                resolve(root, { user }) {
                    console.log(user);
                    if (user._id)
                        user._id = mongoose.Types.ObjectId(user._id);
                    return User.create(user);
                }
            },
            addTeamToUser: {
                type: UserObjectType,
                args: {
                    team: {
                        type: TeamInputObjectType
                    },
                    user: {
                        type: UserInputObjectType
                    }
                },
                resolve(root, { team, user }) {
                    return User.findOne(user).then(u => {
                        var teams = [team];
                        if (u.teams) {
                            const index = u.teams.findIndex(t => t.name === team.name && t.country === team.country);
                            if (index === -1)
                                teams = [team, ...u.teams];
                            else
                                teams = u.teams;
                        }
                        return User.updateOne(user, { $set: { teams } }).then((result) => {
                            return User.findOne(user);
                        }).catch((err) => {
                            return err;
                        });
                    });

                }
            },
            deleteAll: {
                type: GraphQLString,
                resolve() {
                    return User.deleteMany({}).then((result) => {
                        return `Succesfully deleted ${result.n} users`;
                    }).catch((err) => {
                        return 'Error deleting users';
                    });
                }
            }
        }
    })
});

/* var schema = buildSchema(`
    type Query {
        hello(message: String): String,
        goodbye: String
    }
`);

var root = {
    hello: ({message}) => {
        return message;
    },
    goodbye: () => {
        return 'Goodbye';
    }
} */

module.exports = {
    schema
}