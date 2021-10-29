import { gql } from 'apollo-server'

const books = [
  {
    title: 'The Awakening',
    count: 20,
    author: {
      firstname: 'Kate',
      lastname: 'Chopin',
    },
  },
  {
    title: 'City of Glass',
    count: 10,
    author: {
      firstname: 'Paul',
      lastname: 'Auster',
    },
  },
]

export const typeDefs = gql`
  type Author {
    firstname: String
    lastname: String
    fullname: String
  }

  type Book {
    title: String
    author: Author
  }

  type Query {
    books: [Book]
  }
`

export const resolvers = {
  Author: {
    fullname: (parent) => {
      return `${parent.firstname} ${parent.lastname}`
    },
  },
  Query: {
    books: () => {
      return books
    },
  },
}
