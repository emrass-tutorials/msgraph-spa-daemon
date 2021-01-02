import { useAccount, useMsal } from "@azure/msal-react";

const LogoutButton = () => {
  const { instance, accounts, inProgress } = useMsal();
  const currentAccount = useAccount(accounts[0]);

  return (
    <button
      disabled={!accounts.length}
      onClick={() => instance.logout(currentAccount)}
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
