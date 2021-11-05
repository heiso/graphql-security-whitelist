import { ApolloLink } from '@apollo/client'

export type SecurityWhitelistLinkConfig = {
  whitelist: Record<string, string>
}

export function securityWhitelistLink({ whitelist }: SecurityWhitelistLinkConfig): ApolloLink {
  return new ApolloLink((operation, forward) => {
    if (!forward) {
      throw new Error('securityWhitelistLink cannot be the last link in the chain.')
    }

    if (!whitelist[operation.operationName]) {
      throw new Error('operation not found in given whitelist.')
    }

    if (!whitelist.version) {
      throw new Error('version not found in given whitelist.')
    }

    operation.setContext({
      http: {
        includeQuery: false,
        includeExtensions: true,
      },
    })

    operation.extensions.securityWhitelist = {
      version: whitelist.version,
      hash: whitelist[operation.operationName],
    }

    return forward(operation)
  })
}
