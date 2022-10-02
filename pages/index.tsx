import React from "react";
import type { NextPage } from "next";
import MainLayout, { ContentWithSidebar } from "@c/Layout";
import Feed from "@c/Layoff/Feed";
import { Title } from "@mantine/core";

const Home: NextPage = () => {
  return (
    <MainLayout>
      <ContentWithSidebar>
        <Title order={2} align="center">
          Recent submissions
        </Title>
        <Feed />
      </ContentWithSidebar>
    </MainLayout>
  );
};

export default Home;
