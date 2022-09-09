import React from "react";
import type { NextPage } from "next";
import MainLayout from "@c/Layout";
import { Skeleton, Text, Title, Anchor, Button } from "@mantine/core";
import { useRouter } from "next/router";
import Head from "next/head";

const Home: NextPage = () => {
  const router = useRouter();
  //   const { data, isLoading } = useLayoutPgData(id as string);
  return (
    <MainLayout>
      <Head>
        <title>Layoff watch | recent layoffs reported</title>
      </Head>
      <Title>Recent Layoffs</Title>
    </MainLayout>
  );
};

export default Home;
