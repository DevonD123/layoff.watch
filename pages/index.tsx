import React from "react";
import type { NextPage } from "next";
import MainLayout from "@c/Layout";
import { Text, Skeleton } from "@mantine/core";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("@c/Chart/LayoffLineChart"), {
  ssr: false,
  loading: () => <Skeleton height="100%" width="100%" animate />,
}) as any;

const Home: NextPage = () => {
  return (
    <MainLayout>
      <Text size={"md"} component="h1" align="center">
        Layoffs to date
      </Text>
      <Text size="xs" color="dimmed" component="h2" align="center">
        See which companies and executives have a history of laying off
        employees
      </Text>
      <div style={{ height: "50vh", width: "100%", margin: "0 auto" }}>
        <Chart />
      </div>
    </MainLayout>
  );
};

export default Home;
