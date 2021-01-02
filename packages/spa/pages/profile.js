import { useState, useMemo } from "react";
import { useMsal } from "@azure/msal-react";
import Layout from "../components/Layout";
import { useRedirectIfSignedOut } from "../utils/authHooks";

const Profile = () => {
  useRedirectIfSignedOut("/auth/signin");

  const { instance, accounts } = useMsal();
  const account = useMemo(
    () => instance.getAccountByHomeId(accounts[0]?.homeAccountId),
    [accounts[0]]
  );
  const [apiData, setApiData] = useState(null);

  return (
    <Layout>
      <span>There are currently {accounts.length} users signed in!</span>
    </Layout>
  );
};

export default Profile;
