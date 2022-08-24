import type { NextPage } from "next";
import Head from "next/head";
import AdminNavbar from "@c/Navbar/AdminNavbar";
import CompanyEditGrid from "@c/Company/CompanyEditGrid";
import { Container } from "@mantine/core";

const Company: NextPage = () => {
  return (
    <>
      <Head>
        <title>Companies</title>
      </Head>
      <AdminNavbar />
      <Container>
        <CompanyEditGrid />
      </Container>
    </>
  );
};

export default Company;
