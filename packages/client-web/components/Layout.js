import { useMemo } from "react";
import Link from "next/link";
import Head from "next/head";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

const Layout = ({ children, title = "This is the default title" }) => {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();
  const account = useMemo(
    () => instance.getAccountByHomeId(accounts[0]?.homeAccountId),
    [accounts[0]]
  );

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <nav>
          <Link href="/">
            <a>Home</a>
          </Link>
          {!isAuthenticated && (
            <>
              {" | "}
              <LoginButton />
            </>
          )}
          {isAuthenticated && (
            <>
              {" | "}
              <Link href="/profile">
                <a>Profile</a>
              </Link>
              {" | "}
              <Link href="/users">
                <a>Users List</a>
              </Link>
              {" | "}
              <span>Hello {account.idTokenClaims?.given_name}</span>
              {" | "}
              <LogoutButton />
            </>
          )}
        </nav>
      </header>
      {children}
      <footer>
        <hr />
        <span>This is the page footer</span>
      </footer>
    </div>
  );
};

export default Layout;
