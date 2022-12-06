const { UserInputError } = require("apollo-server-express")


const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await UserInputError.findOne({ _id: context.user._id})
                
                return userData;
            }
        }
    },
    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await UserInputError.findOne({ email });

            if (!user) {
                throw new Error('No user found')
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new Error('Invalid credentials');
            }
        }
    }
}