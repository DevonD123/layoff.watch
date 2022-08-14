import type { NextPage } from "next";
import Head from "next/head";
import AdminNavbar from "@c/Navbar/AdminNavbar";
import CreateArticleForm from "@c/Article/CreateArticle";

const isDraft = true;
const Home: NextPage = () => {
  const postTitle = isDraft ? "Approve Post" : "Create Post";
  return (
    <>
      <Head>
        <title>{postTitle}</title>
      </Head>
      <AdminNavbar />
      <CreateArticleForm isAdmin isDraft={isDraft} />
    </>
  );
};

export default Home;
