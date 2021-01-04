import { createUser, getAllTenants } from "../../lib/db-admin";

const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const checkJWT = (handler) => async (req, res) => {
  // 1) Check that the access_token exists
  if (!req.headers?.authorization) {
    return res.status(401).end("Authorization header missing");
  }

  const supportedTenants = await getAllTenants();
  console.log("DB Tenants: ", supportedTenants);

  const auth = req.headers.authorization;
  const token = auth.split(" ")[1];

  const validationOptions = {
    audience: process.env.NEXT_PUBLIC_AZURE_APP_ID,
    issuer: supportedTenants.map(
      (t) => `https://login.microsoftonline.com/${t.uid}/v2.0`
    ),
  };

  jwt.verify(token, getSigningKeys, validationOptions, (err, payload) => {
    if (err) {
      // TokenExpiredError is also instanceof JsonWebTokenError (inheritance), so check for it first
      if (err instanceof jwt.TokenExpiredError) {
        return res
          .status(403)
          .end("The JWT token is expired. Refresh the token and try again");
      } else if (err instanceof jwt.JsonWebTokenError) {
        return res.status(403).end("Invalid JWT token");
      } else {
        return res.status(403).end("Forbidden");
      }
    }

    // createUser(`${payload.oid}.${payload.tid}`, {
    //   id: payload.oid,
    //   tenantId: payload.tid,
    //   name: payload.name,
    //   email: payload.email,
    //   givenName: payload.given_name,
    //   familyName: payload.family_name,
    // });

    // The JWT token content is available in payload parameter
    handler(req, res);
  });
};

const getSigningKeys = (header, callback) => {
  const client = jwksClient({
    jwksUri: "https://login.microsoftonline.com/common/discovery/keys",
  });

  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
};

const handler = (req, res) => {
  res
    .status(200)
    .end(
      `Success! This is a private resource and you have the access_token to view it.`
    );
};

export default checkJWT(handler);

// Due to the callbacks still being called asynchronously before the method terminates,
// Next would usually throw a "API resolved without sending a response for /api/private, this may result in stalled requests."
// error. This config prevents that by letting it know that the callback will be resolved.
// Reference: https://github.com/vercel/next.js/issues/10439#issuecomment-633013628
export const config = {
  api: {
    externalResolver: true,
  },
};
