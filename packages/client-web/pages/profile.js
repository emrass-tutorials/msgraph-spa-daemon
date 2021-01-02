import { useState, useEffect, useRef, useMemo } from "react";
import { useAccount, useIsAuthenticated, useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

export default function Profile() {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts, inProgress } = useMsal();
  const account = useMemo(
    () => instance.getAccountByHomeId(accounts[0]?.homeAccountId),
    [accounts[0]]
  );
  const [apiData, setApiData] = useState(null);

  if (!isAuthenticated || !accounts.length) {
    return <p>Need to be signed in!</p>;
  }

  return (
    <>
      <span>There are currently {accounts.length} users signed in!</span>
    </>
  );
}
