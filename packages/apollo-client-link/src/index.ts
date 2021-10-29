import { ApolloLink } from '@apollo/client'

export type SecurityWhitelistLinkConfig = {
  whitelist: Record<string, string>
  version?: string
}

export function securityWhitelistLink({
  whitelist,
  version,
}: SecurityWhitelistLinkConfig): ApolloLink {
  return new ApolloLink((operation, forward) => {
    if (!forward) {
      throw new Error('securityWhitelistLink cannot be the last link in the chain.')
    }

    operation.setContext({
      http: {
        includeQuery: false,
        includeExtensions: true,
      },
    })

    operation.extensions.securityWhitelist = {
      version,
      hash: whitelist[operation.operationName],
    }

    return forward(operation)
  })
}
