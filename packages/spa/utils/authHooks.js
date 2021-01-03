import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useAccount, useMsal } from "@azure/msal-react";

export function useRedirectIfSignedIn(targetPath) {
  const router = useRouter();
  const { accounts, inProgress } = useMsal();

  useEffect(() => {
    if (inProgress === "none" && accounts.length >= 1) {
      router.push(targetPath);
    }
  }, [inProgress, accounts]);
}

export function useRedirectIfSignedOut(targetPath) {
  const router = useRouter();
  const { accounts, inProgress } = useMsal();

  useEffect(() => {
    if (inProgress === "none" && accounts.length <= 0) {
      router.push(targetPath);
    }
  }, [inProgress, accounts]);
}

export function useAuthToken(scopes) {
  const isMountedRef = useRef(false);
  const [accessToken, setAccessToken] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { instance, accounts, inProgress } = useMsal();
  const account = accounts[0]; // useAccount(accounts[0] || { homeAccountId: undefined });

  if (!scopes) scopes = process.env.NEXT_PUBLIC_AZURE_APP_SCOPES?.split(",");

  useEffect(() => {
    isMountedRef.current = true;
    (async () => {
      try {
        if (account) {
          const response = await instance.acquireTokenSilent({
            scopes,
            account,
          });
          if (isMountedRef.current) {
            setAccessToken(response.accessToken);
            setIdToken(response.idToken);
          }
        }
      } catch (e) {
        if (isMountedRef.current) setError(e);
      } finally {
        if (isMountedRef.current) setIsLoading(false);
      }
    })();

    return () => {
      isMountedRef.current = false;
    };
  }, [account, instance]);

  return { accessToken, idToken, error, isLoading };
}
