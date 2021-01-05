const admin = require("firebase-admin");
const { db } = require("./firebase-admin.js");

module.exports = {
  getAllConsentedTenants: async () => {
    const snapshot = await db
      .collection("tenants")
      .where("consented", "==", true)
      .get();
    const tenants = [];
    snapshot.forEach((doc) => {
      tenants.push({ id: doc.id, ...doc.data() });
    });

    return tenants;
  },
  getTenant: async (tenantId) => {
    const doc = await db.collection("tenants").doc(tenantId).get();
    const tenant = { id: tenantId, ...doc.data() };
    return tenant;
  },
};
