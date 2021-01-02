import { useMsal } from "@azure/msal-react";

const LoginButton = () => {
  const { instance, accounts, inProgress } = useMsal();
  const request = {
    scopes: ["email", "offline_access", "openid", "profile", "User.Read"],
  };

  const buttonText = inProgress === "login" ? "Logging In ..." : "Log In";

  return (
    <button
      disabled={accounts.length > 0 || inProgress === "login"}
      onClick={() => instance.loginRedirect(request)}
    >
      {buttonText}
    </button>
  );
};

export default LoginButton;
