// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs
const typeDefs = gql`

    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        _id: ID
        bookId: String
        authors: [String]
        title: String
        image: String
        link: String
        description: String
    }

    type Auth {
        token: String
        user: User
    }

    type Query {
        me: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(authors: [String], title: String, bookId: String, image: String, link: String, description: String): User
        removeBook(bookId: ID!): User
    }
`;

// export the typeDefs
module.exports = typeDefs;