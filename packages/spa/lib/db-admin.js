import admin from "firebase-admin";
import { db } from "./firebase-admin";

export async function getAllTenants() {
  const snapshot = await db.collection("tenants").get();
  const tenants = [];
  snapshot.forEach((doc) => {
    tenants.push({ id: doc.id, ...doc.data() });
  });

  return tenants;
}

export async function getTenant(tenantId) {
  const doc = await db.collection("tenants").doc(tenantId).get();
  const tenant = { id: tenantId, ...doc.data() };
  return tenant;
}

export function createTenant(uid, data) {
  return db
    .collection("tenants")
    .doc(uid)
    .set(
      {
        uid,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        ...data,
      },
      { merge: true }
    );
}

export function createUser(uid, data) {
  return db
    .collection("users")
    .doc(uid)
    .set({ uid, ...data }, { merge: true });
}
