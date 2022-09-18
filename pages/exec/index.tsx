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
  Button,
} from "@mantine/core";
import Head from "next/head";
import Link from "next/link";
import { IconCaretRight } from "@tabler/icons";
import AddExecButton from "@c/AddExecButton/AddExecButton";
import { useAllCSuitSummary } from "@c/Csuit/db";
import CsuitSummaryListItem from "@c/Csuit/CsuitSummaryListItem";

const ExecHome: NextPage = () => {
  const { data, isLoading } = useAllCSuitSummary();
  const [filter, setFilter] = useState("");
  const [input, setInput] = useState("");

  return (
    <MainLayout>
      <Head>
        <title>Layoff watch | Execs</title>
      </Head>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
          position: "sticky",
          //position:'-webkit-sticky'
        }}
      >
        <Title order={2} align="left">
          Executives{" "}
        </Title>
        <AddExecButton />
      </div>
      <TextInput
        placeholder="Filter"
        value={input}
        onBlur={(e) => setFilter(input)}
        onChange={(e) => setInput((e.target.value || "").toLowerCase())}
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            (e.target as HTMLInputElement).blur();
          }
        }}
      />
      {/* <Card>leader board :( ---- side scroll</Card> */}
      <List mt={15} style={{ listStyle: "none" }}>
        {isLoading &&
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((x) => (
            <Skeleton key={x} height={20} width={250} mb={10} />
          ))}

        {!isLoading &&
          data &&
          data.length >= 1 &&
          data.map((x: any) => (
            <CsuitSummaryListItem filter={filter} key={x.id} {...x} />
          ))}
      </List>
    </MainLayout>
  );
};

export default ExecHome;
