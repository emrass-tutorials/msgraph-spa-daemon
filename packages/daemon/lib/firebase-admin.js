const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    databaseURL: "https://msgraph-spa-daemon.firebaseio.com/",
  });
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };
