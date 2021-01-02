import { useEffect } from "react";
import { useRouter } from "next/router";
import { useMsal } from "@azure/msal-react";

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
