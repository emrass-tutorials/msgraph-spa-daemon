const express = require("express");
const msal = require("@azure/msal-node");
const graph = require("../graph-client.js");
const router = express.Router();

/* GET users listing. */
router.get("/", async function (req, res, next) {
  // For this route, we are using application permissions, not user permissions!

  if (!req.session.userId) {
    req.flash("error_msg", {
      message: "Need to be signed in",
      debug: "This URL requires authentication. Please sign in.",
    });

    return res.redirect("/"); // Redirect unauthenticated requests to home page
  }

  const { tenantId } = req.app.locals.users[req.session.userId];

  const params = {
    active: { users: true },
    tenantId,
  };

  // MSAL config
  const msalConfig = {
    auth: {
      clientId: process.env.OAUTH_APP_ID,
      clientSecret: process.env.OAUTH_APP_SECRET,
      authority: `https://login.microsoftonline.com/${tenantId}`,
      redirectUri: process.env.OAUTH_APP_REDIRECT_URI,
    },
  };

  const appCCA = new msal.ConfidentialClientApplication(msalConfig);

  const clientCredentialRequest = {
    scopes: ["https://graph.microsoft.com/.default"],
  };

  let accessToken;
  try {
    const response = await appCCA.acquireTokenByClientCredential(
      clientCredentialRequest
    );
    accessToken = response.accessToken;
  } catch (err) {
    req.flash("error_msg", {
      message: "Could not get access token. Try re-granting admin permissions",
      debug: JSON.stringify(err, Object.getOwnPropertyNames(err)),
    });
    return res.redirect("/");
  }

  try {
    const users = await graph.getUsers(accessToken);
    params.users = users.value;
  } catch (err) {
    req.flash("error_msg", {
      message: err.message,
      debug: JSON.stringify(err, Object.getOwnPropertyNames(err)),
    });
    return res.redirect("/");
  }

  res.render("users", params);
});

router.get("/me", async function (req, res) {
  if (!req.session.userId) {
    req.flash("error_msg", {
      message: "Need to be signed in",
      debug: "This URL requires authentication. Please sign in.",
    });

    return res.redirect("/"); // Redirect unauthenticated requests to home page
  }

  const params = {
    active: { me: true },
  };

  // Get the access token
  let accessToken;
  try {
    accessToken = await getAccessToken(
      req.session.userId,
      req.app.locals.msalClient
    );
  } catch (err) {
    req.flash("error_msg", {
      message:
        "Could not get access token. Try signing out and signing in again.",
      debug: JSON.stringify(err, Object.getOwnPropertyNames(err)),
    });
    return;
  }

  try {
    const userDetails = await graph.getUserDetails(
      accessToken,
      req.app.locals.users[req.session.userId].oid
    );
    params.userDetails = userDetails;
  } catch (err) {
    req.flash("error_msg", {
      message: err.message,
      debug: JSON.stringify(err, Object.getOwnPropertyNames(err)),
    });
    return res.redirect("/");
  }

  res.render("user-me", params);
});

async function getAccessToken(userId, msalClient) {
  // Look up the user's account in the cache
  try {
    const accounts = await msalClient.getTokenCache().getAllAccounts();

    const userAccount = accounts.find((a) => a.homeAccountId === userId);

    // Get the token silently
    const response = await msalClient.acquireTokenSilent({
      scopes: process.env.OAUTH_USER_SCOPES.split(","),
      redirectUri: process.env.OAUTH_REDIRECT_URI,
      account: userAccount,
    });

    return response.accessToken;
  } catch (err) {
    console.log(JSON.stringify(err, Object.getOwnPropertyNames(err)));
  }
}

module.exports = router;
