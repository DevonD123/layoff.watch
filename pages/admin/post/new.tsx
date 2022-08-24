import CreateArticleForm from "@c/Article/CreateArticle";
import type { NextPage } from "next";
import Head from "next/head";
import AdminNavbar from "@c/Navbar/AdminNavbar";

const Post: NextPage = () => {
  return (
    <>
      <Head>
        <title>New Post</title>
      </Head>
      <AdminNavbar />
      <CreateArticleForm isAdmin isDraft isOwner />
    </>
  );
};

export default Post;
