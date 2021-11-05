import { ForbiddenError } from 'apollo-server'
import { ApolloServerPlugin } from 'apollo-server-plugin-base'

export type Whitelist = {
  version: string
} & Record<string, string>

export type GraphqlSecurityWhitelistPluginConfig = {
  whitelists: Whitelist[]
  lazyLoadWhitelist?: (version: Whitelist['version']) => Promise<Whitelist | null>
}

export const GraphqlSecurityWhitelistPlugin: (
  config: GraphqlSecurityWhitelistPluginConfig
) => ApolloServerPlugin = ({ whitelists, lazyLoadWhitelist }) => {
  const whitelistsByVersion = whitelists.reduce<Record<Whitelist['version'], Whitelist>>(
    (acc, whitelist) => ({ ...acc, [whitelist.version]: whitelist }),
    {}
  )

  return {
    async requestDidStart(requestContext) {
      const securityWhitelist = requestContext.request.extensions?.securityWhitelist
      if (!securityWhitelist || !securityWhitelist.hash || !securityWhitelist.version) {
        throw new ForbiddenError('Forbidden')
      }

      const { version, hash } = securityWhitelist

      if (!whitelistsByVersion[version] && lazyLoadWhitelist) {
        const whitelist = await lazyLoadWhitelist(version)
        if (whitelist) {
          whitelistsByVersion[version] = whitelist
        }
      }

      const query = whitelistsByVersion[version]?.[hash]
      if (!query) {
        throw new ForbiddenError('Forbidden')
      }

      requestContext.request.query = query
    },
  }
}
