import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, useIsAuthenticated } from "@azure/msal-react";
import "../styles/globals.css";

const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_APP_ID,
    authority: process.env.NEXT_PUBLIC_AZURE_APP_AUTHORITY,
    postLogoutRedirectUri: process.env.NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

const msalPCA = new PublicClientApplication(msalConfig);

function MyApp({ Component, pageProps }) {
  const isAuthenticated = useIsAuthenticated();

  return (
    <MsalProvider instance={msalPCA}>
      <Component {...pageProps} />
    </MsalProvider>
  );
}

export default MyApp;
