import type { NextPage } from "next";
import Head from "next/head";
import AdminNavbar from "@c/Navbar/AdminNavbar";

const User: NextPage = () => {
  return (
    <>
      <Head>
        <title>Users</title>
      </Head>
      <AdminNavbar />
      Users
    </>
  );
};

export default User;
