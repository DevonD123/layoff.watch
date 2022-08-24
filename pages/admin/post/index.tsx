import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import AdminNavbar from "@c/Navbar/AdminNavbar";

const Post: NextPage = () => {
  return (
    <>
      <Head>
        <title>Posts</title>
      </Head>
      <AdminNavbar />
      Posts
      <br />
      <Link href="/admin/post/new" passHref>
        <a>Create a new post</a>
      </Link>
    </>
  );
};

export default Post;
