import { GraphqlSecurityWhitelistPlugin } from '@graphql-security-whitelist/apollo-server-plugin'
import { ApolloServer } from 'apollo-server'
import * as bookSchema from './book.schema'
import whitelist from './generated/graphql-whitelist.json'

const schemas = [bookSchema]

const server = new ApolloServer({
  typeDefs: schemas.map(({ typeDefs }) => typeDefs),
  resolvers: schemas.map(({ resolvers }) => resolvers),
  plugins: [GraphqlSecurityWhitelistPlugin({ whitelist })],
})

server.listen().then(({ url }) => {
  console.log(`🚀 To infinity...and beyond! Server listening on ${url}`)
})
