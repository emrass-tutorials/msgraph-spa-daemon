# MS Graph SPA / Daemon App - Example

Demonstrates the usage of MS Graph API using an SPA for user-delegated access
and a backend daemon for application-level access. User authentication is done
via Authorization Code flow with PKCE. Application authentication is achieved
via Client Credentials flow.

Usage:

```
# starts daemon and SPA client concurrently
yarn start
# starts the daemon only
yarn daemon
# starts the SPA client only
yarn spa
```

## Setup

1. Register the application in the Azure Portal
2. Copy `.env.sample` to `.env` in `daemon` directory and update app id and client secret
3. Maintain `AZURE_APP_SECRET` in SPA `.env.local` file (create file if it does not exist)

## Credits

Combines the tutorials / samples:

1. Microsoft Graph Training Module - Build Node.js Express apps with Microsoft Graph ([Tutorial](https://docs.microsoft.com/en-us/graph/tutorials/node) / [Source Code](https://github.com/microsoftgraph/msgraph-training-nodeexpressapp))
2. ASP.NET multi-tenant daemon ([Tutorial](https://docs.microsoft.com/en-in/azure/active-directory/develop/tutorial-v2-aspnet-daemon-web-app) / [Source Code](https://github.com/Azure-Samples/ms-identity-aspnet-daemon-webapp))
3. MSAL Node Standalone Sample: Client Credentials ([Source Code](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-node-samples/standalone-samples/client-credentials))
4. MSAL Node Standalone Sample: Auth Code ([Source Code](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-node-samples/standalone-samples/auth-code))

## Data Model

### tenants

| Field           | Type      | Comment                                                            |
| --------------- | --------- | ------------------------------------------------------------------ |
| uid             | String    | The tenant ID                                                      |
| provider        | String    | The auth provider, e.g. "microsoft" or "google"                    |
| consented       | Boolean   | Indicates whether admin consent has been given                     |
| lastConsentedAt | Timestamp | Timestamp of latest admin consent confirmation                     |
| paidUntil       | Timestamp | Undefined if never paid or the timestamp the subscription runs out |

### tenant-options

| Field      | Type   | Comment                     |
| ---------- | ------ | --------------------------- |
| tenant_uid | String | The id tenant of the tenant |

### users

| Field           | Type      | Sample                                                                  | Comment                                                    |
| --------------- | --------- | ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| uid             | String    | 3a79b2e6-1234-123e-9999-aab0cd5d1010.444444-1234-1234-9999-123456789012 | Corresponds to the MS HomeAccountID (includes the tenant)  |
| id              | String    | 3a79b2e6-1234-123e-9999-aab0cd5d1010                                    | The user ID                                                |
| tenantId        | String    | 444444-1234-1234-9999-123456789012                                      | The user's tenant ID                                       |
| displayName     | String    | John Doe                                                                | The display name of the user                               |
| givenName       | String    | John                                                                    | The user's given name                                      |
| familyName      | String    | Doe                                                                     | The user's family name                                     |
| email           | String    | john.doe@example.com                                                    | The user's email address                                   |
| createdAt       | Timestamp | 2020-12-24T12:00:00                                                     | Indicates when user account was created (first login)      |
| updatedAt       | Timestamp | 2020-12-24T12:00:00                                                     | Indicates when user data was last udpated                  |
| hasSyncError    | Boolean   | true                                                                    | Indicates if last sync run succeeded for the user (or not) |
| lastSyncErrorAt | Timestamp | 2020-12-24T12:00:00                                                     | Time the last sync error occurred                          |
