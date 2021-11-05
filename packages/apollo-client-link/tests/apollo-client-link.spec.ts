import { ApolloLink, execute, gql, HttpLink } from '@apollo/client'
import fetch from 'jest-fetch-mock'
import { securityWhitelistLink } from '../src'

global.fetch = fetch

describe('Apollo Link', () => {
  const query = gql`
    query Test($id: ID!) {
      foo(id: $id) {
        bar
      }
    }
  `

  const whitelist = {
    version: 'latest',
    Test: 'somequickhash',
  }

  const variables = { id: 1 }

  const data = {
    foo: { bar: true },
  }
  const response = JSON.stringify({ data })

  beforeEach(() => {
    fetch.mockReset()
    fetch.mockResponse(response)
  })

  it('Should not send query', async () => {
    const link = ApolloLink.from([
      securityWhitelistLink({ whitelist }),
      new HttpLink({ uri: 'http://hellothere' }),
    ])

    await new Promise((resolve) => execute(link, { query, variables }).subscribe(resolve))

    const operationName = 'Test'
    const [_, request] = fetch.mock.calls[0]

    expect(request).toBeDefined()
    expect(request?.body).toBe(
      JSON.stringify({
        operationName,
        variables,
        extensions: {
          securityWhitelist: {
            version: 'latest',
            hash: whitelist[operationName],
          },
        },
      })
    )
  })
})
