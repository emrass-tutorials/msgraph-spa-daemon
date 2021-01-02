const router = require("express-promise-router")();
const graph = require("../graph-client.js");

router.get("/requestpermissions", async function (req, res) {
  if (!req.session.userId) {
    req.flash("error_msg", {
      message: "Need to be signed in",
      debug: "This URL requires authentication. Please sign in.",
    });

    return res.redirect("/"); // Redirect unauthenticated requests to home page
  }

  const { tenantId } = req.app.locals.users[req.session.userId];
  res.redirect(
    `https://login.microsoftonline.com/${tenantId}/adminconsent?client_id=${process.env.OAUTH_APP_ID}&redirect_uri=${process.env.OAUTH_ADMINCONSENT_REDIRECT_URI}&scope=${process.env.OAUTH_APP_SCOPES}`
  );
});

router.get("/grantpermissions", async function (req, res) {
  const {
    admin_consent,
    tenant,
    error,
    error_subcode,
    error_description,
  } = req.query;

  if (error || !admin_consent || !tenant) {
    req.flash("error_msg", {
      message: `Error completing authentication: ${error}`,
      debug: error_description || error_subcode,
    });
    return res.redirect("/");
  }

  if (admin_consent && tenant) {
    // Do a full Sign-out, so that the logged in user can obtain a fresh token
    req.flash("info_msg", {
      message:
        "Operation successful. Please sign in again to obtain a fresh token.",
    });
    return res.redirect("/account/signout");
  }
});

/* GET auth callback. */
router.get("/signin", async function (req, res) {
  const urlParameters = {
    scopes: process.env.OAUTH_USER_SCOPES.split(","),
    redirectUri: process.env.OAUTH_REDIRECT_URI,
  };

  try {
    const authUrl = await req.app.locals.msalClient.getAuthCodeUrl(
      urlParameters
    );
    res.redirect(authUrl);
  } catch (error) {
    console.log(`Error: ${error}`);
    req.flash("error_msg", {
      message: "Error getting auth URL",
      debug: JSON.stringify(error, Object.getOwnPropertyNames(error)),
    });
    res.redirect("/");
  }
});

router.get("/callback", async function (req, res) {
  if (req.query.error) {
    const { error, error_description, error_uri } = req.query;
    req.flash("error_msg", {
      message: `Error completing authentication: ${error}`,
      debug: error_description,
    });
    return res.redirect("/");
  }

  const tokenRequest = {
    code: req.query.code,
    scopes: process.env.OAUTH_USER_SCOPES.split(","),
    redirectUri: process.env.OAUTH_REDIRECT_URI,
  };

  try {
    const response = await req.app.locals.msalClient.acquireTokenByCode(
      tokenRequest
    );

    // Save the user's homeAccountId in their session
    req.session.userId = response.account.homeAccountId;

    // Add the user to user storage
    req.app.locals.users[req.session.userId] = {
      displayName: response.account.name,
      givenName: response.account.idTokenClaims.given_name,
      email: response.account.idTokenClaims.email || response.account.username,
      tenantId: response.account.tenantId,
      oid: response.account.idTokenClaims.oid,
    };
  } catch (error) {
    req.flash("error_msg", {
      message: "Error completing authentication",
      debug: JSON.stringify(error, Object.getOwnPropertyNames(error)),
    });
  }

  res.redirect("/");
});

router.get("/signout", async function (req, res) {
  // Sign out
  if (req.session.userId) {
    // Look up the user's account in the cache
    const accounts = await req.app.locals.msalClient
      .getTokenCache()
      .getAllAccounts();

    const userAccount = accounts.find(
      (a) => a.homeAccountId === req.session.userId
    );

    // Remove the account
    if (userAccount) {
      req.app.locals.msalClient.getTokenCache().removeAccount(userAccount);
    }
  }

  // Destroy the user's session
  req.session.destroy(function (err) {
    res.redirect("/");
  });
});

module.exports = router;
