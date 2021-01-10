import { useMsal } from "@azure/msal-react";
import Layout from "../components/Layout";
import { useAuthToken, useRedirectIfSignedOut } from "../utils/authHooks";
import useGraph from "../utils/useGraph";

const Profile = () => {
  useRedirectIfSignedOut("/auth/signin");

  const { accessToken, idToken, error, isLoading } = useAuthToken();
  const { accounts } = useMsal();
  const { data: userProfile, error: fetchError, fetchIsLoading } = useGraph(
    accessToken,
    "https://graph.microsoft.com/v1.0/me"
  );

  if (isLoading || fetchIsLoading || !userProfile || !accounts[0]) {
    return (
      <Layout>
        <span>Loading ...</span>
      </Layout>
    );
  }

  const tenantId = accounts[0].tenantId;
  return (
    <Layout>
      <h1>{userProfile.displayName}</h1>
      <p>Email: {userProfile.mail}</p>
      <p>Job Title: {userProfile.jobTitle}</p>
      <p>Phone(s): {userProfile.businessPhones.join(", ")}</p>
      <hr />
      <a
        href={`https://login.microsoftonline.com/${tenantId}/adminconsent?client_id=${process.env.NEXT_PUBLIC_AZURE_APP_ID}&redirect_uri=${process.env.NEXT_PUBLIC_AZURE_ADMINCONSENT_REDIRECT_URI}&scope=https://graph.microsoft.com/.default`}
      >
        Request Admin permissions
      </a>
    </Layout>
  );
};

export default Profile;
