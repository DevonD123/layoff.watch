import type { NextPage } from "next";
import Head from "next/head";
import { Container } from "@mantine/core";
import AdminNavbar from "@c/Navbar/AdminNavbar";
import CsuitEditTable from "@c/Csuit/CsuitEditTable";

const CSuit: NextPage = () => {
  return (
    <>
      <Head>
        <title>Execs</title>
      </Head>
      <AdminNavbar />
      <Container>
        <CsuitEditTable />
      </Container>
    </>
  );
};

export default CSuit;
