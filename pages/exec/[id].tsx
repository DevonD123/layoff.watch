import React from "react";
import type { NextPage } from "next";
import MainLayout from "@c/Layout";
import { Title, Text, Skeleton } from "@mantine/core";
import Head from "next/head";
import { useRouter } from "next/router";
import MoreInfoButton from "@c/MoreInfoButton/MoreInfoButton";
import ReportButton from "@c/ReportButton/ReportButton";

const Home: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const isLoading = true;
  const data: any = {};

  return (
    <MainLayout>
      <Head>
        <title>Layoff watch | Exeectuives {!isLoading && data.name}</title>
      </Head>
      {isLoading ? (
        <Skeleton width="90%" style={{ margin: "0 auto" }} />
      ) : (
        <Title order={2} align="center">
          {data.name} ({data.role})
        </Title>
      )}
      {isLoading ? (
        <Skeleton width="90%" height={100} style={{ margin: "0 auto" }} />
      ) : (
        <Text color="dimmed" align="center" mb={15} mt={5}>
          {data.bio || "No bio added"}
        </Text>
      )}

      {!isLoading && <MoreInfoButton id={id as string} type="position" />}
      {!isLoading && <ReportButton id={id as string} type="position" />}
    </MainLayout>
  );
};

export default Home;
