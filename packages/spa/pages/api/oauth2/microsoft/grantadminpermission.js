import { createTenant } from "../../../../lib/db-admin";

export default async (req, res) => {
  const { tenant, error, error_description } = req.query;

  if (error) {
    console.log(tenant, error, error_description);
    return res
      .writeHead(302, { Location: "http://localhost:3000/profile" })
      .end();
  }

  try {
    createTenant(tenant, { consented: true, lastConsentedAt: new Date() });
  } catch (error) {
    console.log(error);
  } finally {
    res.writeHead(302, { Location: "http://localhost:3000/profile" }).end();
  }
};
