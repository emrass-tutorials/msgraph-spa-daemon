const express = require("express");
const router = require("express-promise-router")();

const graph = require("../graph-client.js");

router.get("/checkpermission", async function (req, res) {
  let accessToken;
  try {
    accessToken = await getAccessToken(req.app.locals.msalClient);
    if (accessToken && accessToken.length > 0) {
      return res.json({ granted: true, accessToken });
    } else {
      return res.json({ granted: false });
    }
  } catch (err) {
    return res.json({ granted: false });
  }
});

router.get("/run", async function (req, res) {
  let accessToken;
  try {
    accessToken = await getAccessToken(req.app.locals.msalClient);
  } catch (err) {
    console.error(
      "Could not get access token. Try signing out and signing in again.",
      JSON.stringify(err, Object.getOwnPropertyNames(err))
    );
    return;
  }

  if (accessToken && accessToken.length > 0) {
    try {
      // Get the events
      const events = await graph.getUsers();
      console.log("Users retrieved: ", users);
    } catch (err) {
      console.error(
        "Could not fetch events",
        JSON.stringify(err, Object.getOwnPropertyNames(err))
      );
      return;
    }
  } else {
    console.error("error_msg", "Could not get an access token");
  }

  res.status(201);
});

async function getAccessToken(msalClient) {
  try {
    const tokenResponse = await msalClient.acquireTokenByClientCredential({
      scopes: ["https://graph.microsoft.com/.default"],
    });

    return tokenResponse.accessToken;
  } catch (err) {
    console.error(JSON.stringify(err, Object.getOwnPropertyNames(err)));
  }
}

module.exports = router;
