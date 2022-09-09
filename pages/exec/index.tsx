import React from "react";
import { useState } from "react";
import type { NextPage } from "next";
import MainLayout from "@c/Layout";
import {
  Title,
  Text,
  TextInput,
  List,
  Skeleton,
  ThemeIcon,
  Anchor,
  ActionIcon,
  Card,
} from "@mantine/core";
import Head from "next/head";
import Link from "next/link";
import { IconCaretRight } from "@tabler/icons";

const ExecHome: NextPage = () => {
  const [filter, setFilter] = useState("");
  const isLoading = true;
  return (
    <MainLayout>
      <Head>
        <title>Layoff watch | Execs</title>
      </Head>
      <Title order={2} align="center">
        Executives
      </Title>
      <TextInput
        placeholder="Filter"
        value={filter}
        onChange={(e) => setFilter((e.target.value || "").toLowerCase())}
      />
      <Card>leader board :( ---- side scroll</Card>
      <List mt={15} style={{ listStyle: "none" }}>
        {isLoading &&
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((x) => (
            <Skeleton key={x} height={20} width={250} mb={10} />
          ))}
      </List>
    </MainLayout>
  );
};

export default ExecHome;
