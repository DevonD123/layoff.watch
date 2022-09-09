import React, { useState } from "react";
import type { NextPage } from "next";
import MainLayout from "@c/Layout";
import { Anchor, Skeleton } from "@mantine/core";
import Card from "@c/Card/Card";
import dynamic from "next/dynamic";
import Feed from "@c/Layoff/Feed";

const Chart = dynamic(() => import("@c/Chart/LayoffLineChart"), {
  ssr: false,
  loading: () => <Skeleton height="100%" width="100%" animate />,
}) as any;

const Home: NextPage = () => {
  const [open, setOpen] = useState(false);
  return (
    <MainLayout>
      <Card isSmall isDark title="Layoffs to date">
        <Anchor onClick={() => setOpen(!open)}>
          {open ? "Minimize chart" : "See Chart"}
        </Anchor>
        {open && (
          <div style={{ width: "100%", height: 300 }}>
            <Chart />
          </div>
        )}
      </Card>
      <Feed />
    </MainLayout>
  );
};

export default Home;
