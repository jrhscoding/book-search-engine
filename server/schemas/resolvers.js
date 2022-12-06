const { AuthenticationError } = require("apollo-server-express");
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await UserInputError.findOne({ _id: context.user._id})
                
                return userData;
            }

            throw new AuthenticationError('Not logged in');
        }
    },
    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await UserInputError.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user found')
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Invalid credentials');
            }

            const token = signToken(user);

            return { signToken ,user };
        },

        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },

        saveBook: async(parent, args, { user }) => {
            if (user) {
                const savedBook = await User.findOneAndUpdate(
                    {_id: user._id},
                    {$addToSet: {saveBook: args}},
                    {new: true}
                )
                return savedBook;
            }
            throw new AuthenticationError('Not logged in');
        },

        removeBook: async (parent, args, { user }) => {
            if (user) {
                const removedBook = await User.findOneAndDelete(
                    {_id: user._id},
                    {$pull: {removeBook: args}},
                    {new: true}
                )
                return removedBook;
            }
            throw new AuthenticationError('Not logged in');
        }
    }
}

module.exports = resolvers;