import { useEffect, useRef, useState } from "react";

export default function useGraph(accessToken, url) {
  const isMountedRef = useRef(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    isMountedRef.current = true;
    if (accessToken) {
      (async () => {
        try {
          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (response.ok) {
            const json = await response.json();
            if (isMountedRef.current) setData(json);
          } else {
            throw response;
          }
        } catch (e) {
          if (isMountedRef.current) setError(e);
        } finally {
          if (isMountedRef.current) setIsLoading(false);
        }
      })();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [accessToken, url]);

  return { data, error, isLoading };
}
