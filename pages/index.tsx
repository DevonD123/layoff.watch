import React from "react";
import type { NextPage } from "next";
import MainLayout, { ContentWithSidebar } from "@c/Layout";
import Feed from "@c/Layoff/Feed";

const Home: NextPage = () => {
  return (
    <MainLayout>
      <ContentWithSidebar>
        <Feed />
      </ContentWithSidebar>
    </MainLayout>
  );
};

export default Home;
