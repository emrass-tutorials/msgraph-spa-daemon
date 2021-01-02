import { useMemo } from "react";
import Link from "next/link";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

const Header = () => {
  const { instance, accounts } = useMsal();
  const account = useMemo(
    () => instance.getAccountByHomeId(accounts[0]?.homeAccountId),
    [accounts[0]]
  );

  return (
    <header>
      <nav>
        <Link href="/">
          <a>Home</a>
        </Link>
        <UnauthenticatedTemplate>
          {" | "}
          <Link href="/auth/signin">
            <a>Sign In</a>
          </Link>
        </UnauthenticatedTemplate>
        <AuthenticatedTemplate>
          {" | "}
          <Link href="/profile">
            <a>Profile</a>
          </Link>
          {" | "}
          <Link href="/users">
            <a>Users List</a>
          </Link>
          {" | "}
          <span>Hello {account?.idTokenClaims?.given_name}</span>
          {" | "}
          <LogoutButton />
        </AuthenticatedTemplate>
      </nav>
    </header>
  );
};

export default Header;
