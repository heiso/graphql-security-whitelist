import { ForbiddenError } from 'apollo-server'
import { ApolloServerPlugin } from 'apollo-server-plugin-base'

export type GraphqlSecurityWhitelistPluginConfig = {
  whitelist: Record<string, string>
  version?: string
}

export const GraphqlSecurityWhitelistPlugin: (
  config: GraphqlSecurityWhitelistPluginConfig
) => ApolloServerPlugin = ({ whitelist, version }) => {
  return {
    async requestDidStart(requestContext) {
      const securityWhitelist = requestContext.request.extensions?.securityWhitelist
      if (!securityWhitelist || !securityWhitelist.hash) {
        throw new ForbiddenError('Forbidden')
      }

      const query = whitelist[securityWhitelist.hash]
      if (!query) {
        throw new ForbiddenError('Forbidden')
      }

      requestContext.request.query = query
    },
  }
}
