import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client'
import { securityWhitelistLink } from '@graphql-security-whitelist/apollo-client-link'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import whitelist from './generated/graphql-whitelist.json'
import './index.css'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([
    securityWhitelistLink({ whitelist }),
    new HttpLink({
      uri: 'http://localhost:4000/graphql',
    }),
  ]),
})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
