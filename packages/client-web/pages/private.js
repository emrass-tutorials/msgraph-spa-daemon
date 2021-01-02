import { useState, useEffect, useRef, useMemo } from "react";
import { useAccount, useIsAuthenticated, useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

export default function Private() {
  const isMountedRef = useRef(false);
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts, inProgress } = useMsal();
  const account = useMemo(
    () => instance.getAccountByHomeId(accounts[0]?.homeAccountId),
    [accounts[0]]
  );
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    isMountedRef.current = true;
    if (account) {
      const request = { scopes: ["User.Read"], account: account };
      (async () => {
        let tokenResponse;
        try {
          tokenResponse = await instance.acquireTokenSilent(request);
        } catch (e) {
          if (e instanceof InteractionRequiredAuthError) {
            tokenResponse = instance.acquireTokenPopup(request);
          }
        }
        const token = tokenResponse.idToken;
        console.log(`ID Token: ${token}`);
        const response = await fetch("http://localhost:4000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }

        setApiData(await response.json());
      })();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [account, instance]);

  if (!isAuthenticated) {
    return <p>Need to be signed in!</p>;
  }

  if (accounts.length > 0) {
    return (
      <>
        <span>There are currently {accounts.length} users signed in!</span>
        {apiData && (
          <span>Data retreived from API: {JSON.stringify(apiData)}</span>
        )}
      </>
    );
  } else if (inProgress === "login") {
    return <span>Login is currently in progress!</span>;
  } else {
    return <p>Not logged in</p>;
  }
}
