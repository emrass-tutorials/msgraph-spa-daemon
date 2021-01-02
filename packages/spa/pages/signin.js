import Layout from "../components/Layout";
import LoginButton from "../components/LoginButton";
import { useRedirectIfSignedIn } from "../utils/authHooks";

const Signin = () => {
  useRedirectIfSignedIn("/profile");

  return (
    <Layout>
      <LoginButton />
    </Layout>
  );
};

export default Signin;
