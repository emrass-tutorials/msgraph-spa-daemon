import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import Layout from "../components/Layout";
import styles from "../styles/Home.module.css";
import { useRedirectIfSignedIn } from "../utils/authHooks";

export default function Home() {
  useRedirectIfSignedIn("/profile");

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
