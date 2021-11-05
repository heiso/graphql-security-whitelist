import { GraphQLRequestContext } from 'apollo-server-core'
import { GraphqlSecurityWhitelistPlugin } from '../src'

function getContext(hash: string, version: string) {
  return {
    request: { extensions: { securityWhitelist: { hash, version } } },
  } as unknown as GraphQLRequestContext
}

describe('Apollo Plugin', () => {
  const whitelistV1 = {
    version: 'v1',
    somequickhash: 'query Test {\n  test {\n name\n __typename\n  }\n}',
  }

  const whitelistV2 = {
    version: 'v2',
    somequickhash: 'query Test {\n  test {\n name\n label\n __typename\n  }\n}',
  }

  it('Should throw if extension does not exist', async () => {
    const plugin = GraphqlSecurityWhitelistPlugin({ whitelists: [whitelistV1, whitelistV2] })

    const context = {
      request: { extensions: {} },
    } as unknown as GraphQLRequestContext

    expect(async () => {
      await plugin.requestDidStart?.(context)
    }).rejects.toThrowError('Forbidden')
  })

  it('Should throw if version does not exist', async () => {
    const plugin = GraphqlSecurityWhitelistPlugin({ whitelists: [whitelistV1, whitelistV2] })

    const context = getContext('somequickhash', 'v999')

    expect(async () => {
      await plugin.requestDidStart?.(context)
    }).rejects.toThrowError('Forbidden')
  })

  it('Should throw if hash does not exist', async () => {
    const plugin = GraphqlSecurityWhitelistPlugin({ whitelists: [whitelistV1, whitelistV2] })

    const context = getContext('nope', 'v1')

    expect(async () => {
      await plugin.requestDidStart?.(context)
    }).rejects.toThrowError('Forbidden')
  })

  it('Should throw if lazyLodedWhitelist returns null', async () => {
    const plugin = GraphqlSecurityWhitelistPlugin({
      whitelists: [],
      lazyLoadWhitelist: async () => null,
    })

    const context = getContext('somequickhash', 'v1')

    expect(async () => {
      await plugin.requestDidStart?.(context)
    }).rejects.toThrowError('Forbidden')
  })

  it("Should throw if lazyLodedWhitelist's hash does not exist", async () => {
    const plugin = GraphqlSecurityWhitelistPlugin({
      whitelists: [],
      lazyLoadWhitelist: async () => whitelistV1,
    })

    const context = getContext('nope', 'v1')

    expect(async () => {
      await plugin.requestDidStart?.(context)
    }).rejects.toThrowError('Forbidden')
  })

  it('Should add query to context', async () => {
    const plugin = GraphqlSecurityWhitelistPlugin({ whitelists: [whitelistV1, whitelistV2] })

    const context = getContext('somequickhash', 'v2')
    await plugin.requestDidStart?.(context)

    expect(context.request.query).toBe(whitelistV2.somequickhash)
  })

  it('Should add query to context with v2 version', async () => {
    const plugin = GraphqlSecurityWhitelistPlugin({ whitelists: [whitelistV1, whitelistV2] })

    const context = getContext('somequickhash', 'v2')
    await plugin.requestDidStart?.(context)

    expect(context.request.query).toBe(whitelistV2.somequickhash)
  })

  it('Should lazyLoad whitelist', async () => {
    const plugin = GraphqlSecurityWhitelistPlugin({
      whitelists: [],
      lazyLoadWhitelist: async (version) => {
        if (version === 'v1') return whitelistV1
        if (version === 'v2') return whitelistV2
        return null
      },
    })

    const context = getContext('somequickhash', 'v1')
    await plugin.requestDidStart?.(context)

    expect(context.request.query).toBe(whitelistV1.somequickhash)
  })
})
