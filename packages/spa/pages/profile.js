import Layout from "../components/Layout";
import { useAccessToken, useRedirectIfSignedOut } from "../utils/authHooks";
import useGraph from "../utils/useGraph";

const Profile = () => {
  useRedirectIfSignedOut("/auth/signin");

  const { accessToken, error, isLoading } = useAccessToken();
  const { data: userProfile, error: fetchError, fetchIsLoading } = useGraph(
    accessToken,
    "https://graph.microsoft.com/v1.0/me"
  );

  if (isLoading || fetchIsLoading || !userProfile) {
    return (
      <Layout>
        <span>Loading ...</span>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1>{userProfile.displayName}</h1>
      <p>Email: {userProfile.mail}</p>
      <p>Job Title: {userProfile.jobTitle}</p>
      <p>Phone(s): {userProfile.businessPhones.join(", ")}</p>
    </Layout>
  );
};

export default Profile;
