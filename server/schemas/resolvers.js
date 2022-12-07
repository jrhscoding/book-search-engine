const { AuthenticationError } = require("apollo-server-express");
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id})
                
                return userData;
            }

            throw new AuthenticationError('Not logged in');
        }
    },
    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user found')
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Invalid credentials');
            }

            const token = signToken(user);

            return { token ,user };
        },

        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },

        saveBook: async(parent, args, context) => {
            console.log(context);
            if (context.user) {
                const savedBook = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$addToSet: {savedBooks: args}},
                    {new: true}
                )
                return savedBook;
            }
            throw new AuthenticationError('Not logged in I guess?');
        },

        removeBook: async (parent, args, { user }) => {
            if (user) {
                const removedBook = await User.findOneAndDelete(
                    {_id: user._id},
                    {$pull: {savedBooks: args}},
                    {new: true}
                )
                return removedBook;
            }
            throw new AuthenticationError('Not logged in');
        }
    }
}

module.exports = resolvers;