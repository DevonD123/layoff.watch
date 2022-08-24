import type { NextPage } from "next";
import Head from "next/head";
import AdminNavbar from "@c/Navbar/AdminNavbar";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Admin home</title>
      </Head>
      <AdminNavbar />
      Home - add a dashbaord
    </>
  );
};

export default Home;
