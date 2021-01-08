require("dotenv").config();

const msal = require("@azure/msal-node");
const { getAllConsentedTenants } = require("./lib/db-admin");
const graph = require("./lib/graph-client.js");

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
        // clientSecret: process.env.OAUTH_APP_SECRET,
        clientCertificate: {
          thumbprint: process.env.OAUTH_APP_CERT_THUMBPRINT,
          privateKey: process.env.OAUTH_APP_CERT_PRIVATE_KEY,
        },
        // trailing "/" is important when using certificates! - see https://sebastian-rogers.medium.com/could-not-resolve-endpoints-3f66bd9dc9
        authority: `https://login.microsoftonline.com/${tenant.id}/`,
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
    const calendarEvents = {};
    try {
      users = await graph.getUsers(accessToken);
      for (let i = 0; i < users.length; i++) {
        calendarEvents[users[i].id] = await graph.getCalendarView(
          accessToken,
          users[i].id,
          "2020-12-01T00:00:00",
          "2021-02-01T00:00:00"
        );
      }
    } catch (err) {
      console.error(tenant.id, err);
      return;
    }

    console.log("Dumping calendar events for ", tenant.id);
    console.log(calendarEvents);
  });
}

dumpUsers();
