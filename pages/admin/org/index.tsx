import type { NextPage } from "next";
import Head from "next/head";
import { Container } from "@mantine/core";
import AdminNavbar from "@c/Navbar/AdminNavbar";
import OrgEditGrid from "@c/Org/OrgEditGrid";

const CSuit: NextPage = () => {
  return (
    <>
      <Head>
        <title>Orgs</title>
      </Head>
      <AdminNavbar />
      <Container>
        <OrgEditGrid />
      </Container>
    </>
  );
};

export default CSuit;
