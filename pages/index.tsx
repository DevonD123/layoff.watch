import React from "react";
import type { NextPage } from "next";
import MainLayout from "@c/Layout";
import { Title, Text } from "@mantine/core";
import RecentLayoffsCard from "@c/Company/RecentLayoffsCard";

const Home: NextPage = () => {
  return (
    <MainLayout>
      <Title order={1} align="center">
        Layoff Watch
      </Title>
      <Text size="md" color="dimmed" component="h2" align="center">
        See which companies and executives have a history of laying off
        employees
      </Text>
      <RecentLayoffsCard />
    </MainLayout>
  );
};

export default Home;
