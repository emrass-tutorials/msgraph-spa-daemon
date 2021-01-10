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

## How to Generate A Certificate

Run the following command to generate a self-signed certificate:

```
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 999 -nodes -subj "/C=US/ST=CA/L=Sunnyvale/O=Org/OU=root/CN=msgraph-spa-daemon/emailAddress=support@example.com"
```

Note that we cannot use `rsa:4096` because the size of environment variables is limited to 4kb in AWS, and we need to be able to set the private key in an env variable.

Note the `-nodes` (no DES) at the end, which will generate an unencrypted private key.

Afterwards, paste the content of the private key into your `.env` file under the `OAUTH_APP_CERT_PRIVATE_KEY` key. Make sure to keep the quotes at the beginning and end. You will also need to replace the linebreaks with `\n` notation. Use search/replace function of your editor / IDE for that. Just select the pasted certificate part, select option "Replace within selection", enable regex and type search `\n` replace with `\\n`.

Upload the certificate in your Azure app registry. After upload, you will see the calculated thumbprint of the certificate. Copy/paste it into the
`OAUTH_APP_CERT_THUMBPRINT` environment variable.

Note: Make sure to include a trailing slash `/` in the authority field. Otherwise you will receive an `ClientAuthError: endpoints_resolution_error: Error: could not resolve endpoints. Please check network and try again. Detail: Discovery incomplete.` error. I'm glad I found [this article](https://sebastian-rogers.medium.com/could-not-resolve-endpoints-3f66bd9dc9) that pointed me to the solution.

## Credits

Combines the tutorials / samples:

1. Microsoft Graph Training Module - Build Node.js Express apps with Microsoft Graph ([Tutorial](https://docs.microsoft.com/en-us/graph/tutorials/node) / [Source Code](https://github.com/microsoftgraph/msgraph-training-nodeexpressapp))
2. ASP.NET multi-tenant daemon ([Tutorial](https://docs.microsoft.com/en-in/azure/active-directory/develop/tutorial-v2-aspnet-daemon-web-app) / [Source Code](https://github.com/Azure-Samples/ms-identity-aspnet-daemon-webapp))
3. MSAL Node Standalone Sample: Client Credentials ([Source Code](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-node-samples/standalone-samples/client-credentials))
4. MSAL Node Standalone Sample: Auth Code ([Source Code](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-node-samples/standalone-samples/auth-code))
