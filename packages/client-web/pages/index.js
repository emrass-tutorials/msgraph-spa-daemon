import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import Head from "next/head";
import Layout from "../components/Layout";
import LoginButton from "../components/LoginButton";
import LogoutButton from "../components/LogoutButton";
import styles from "../styles/Home.module.css";

export default function Home() {
  const pageTitle =
    "Example of MS Graph API Usage with an Integrated SPA and Daemon Setup";

  return (
    <Layout title={pageTitle}>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>{pageTitle}</h1>
        </main>
      </div>
    </Layout>
  );
}
