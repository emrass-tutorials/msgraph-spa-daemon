require("dotenv").config();

const msal = require("@azure/msal-node");
const { getAllConsentedTenants } = require("./lib/db-admin");
const graph = require("./graph-client.js");

async function dumpUsers() {
  const clientCredentialRequest = {
    scopes: ["https://graph.microsoft.com/.default"],
  };

  const tenants = await getAllConsentedTenants();
  console.log("Dumping users for tenants: ", tenants);

  tenants.forEach(async (tenant) => {
    const msalConfig = {
      auth: {
        clientId: process.env.OAUTH_APP_ID,
        clientSecret: process.env.OAUTH_APP_SECRET,
        authority: `https://login.microsoftonline.com/${tenant.id}`,
        redirectUri: process.env.OAUTH_APP_REDIRECT_URI,
      },
    };

    const appCCA = new msal.ConfidentialClientApplication(msalConfig);
    let accessToken;
    try {
      const response = await appCCA.acquireTokenByClientCredential(
        clientCredentialRequest
      );
      accessToken = response.accessToken;
    } catch (err) {
      console.error(tenant.id, err);
      return;
    }

    let users;
    try {
      users = await graph.getUsers(accessToken);
    } catch (err) {
      console.error(tenant.id, err);
      return;
    }

    console.log("Dumping users for ", tenant.id);
    console.log(users);
  });
}

dumpUsers();
