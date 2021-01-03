import { useMsal } from "@azure/msal-react";

const LoginButton = () => {
  const { instance, accounts, inProgress } = useMsal();
  const request = {
    scopes: process.env.NEXT_PUBLIC_AZURE_APP_SCOPES?.split(","),
  };

  const buttonText =
    inProgress === "login" ? "Logging In ..." : "Log In with Microsoft 365";

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
