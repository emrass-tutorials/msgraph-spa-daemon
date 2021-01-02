import { useEffect } from "react";
import { useRouter } from "next/router";
import { useIsAuthenticated } from "@azure/msal-react";

export function useRedirectIfSignedIn(targetPath) {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (isAuthenticated) {
      router.push(targetPath);
    }
  }, [isAuthenticated]);
}

export function useRedirectIfSignedOut(targetPath) {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(targetPath);
    }
  }, [isAuthenticated]);
}
