import React from "react";
import type { NextPage } from "next";
import MainLayout from "@c/Layout";
import { Text, Title } from "@mantine/core";
import Head from "next/head";

const PIP: NextPage = () => {
  return (
    <MainLayout>
      <Head>
        <title>Layoff watch | what is a PIP?</title>
      </Head>
      <Title align="center">What is a PIP?</Title>
      <Text>
        A PIP or &quot;Performance Improvement Plan&quot; is a system companies
        impliment to handle poor performers. Generally there is a small
        percentage of employees that recieve the PIP each year to meet a quota.
        In theory these employees can improve and be back to working as normal
        however in practice the manage - employee relationship is usually
        damaged and future bonuses/promotions etc are affected.
      </Text>
      <Text>
        Many companies will use this to trim headcount and avoid layoffs if they
        are not backfilling positions or a performance improvements plan can be
        used to &quot;hire quick fire quick&quot; and put more pressure on the
        employees to perform.
      </Text>
    </MainLayout>
  );
};

export default PIP;
