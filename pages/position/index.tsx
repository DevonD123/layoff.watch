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
} from "@mantine/core";
import Head from "next/head";
import { useAllPositions } from "@c/Position/db";
import Link from "next/link";
import { IconCaretRight } from "@tabler/icons";

const Home: NextPage = () => {
  const [filter, setFilter] = useState("");
  const { data, isLoading } = useAllPositions();
  return (
    <MainLayout>
      <Head>
        <title>Layoff watch | Positions</title>
      </Head>
      <Title order={2} align="center">
        Positions
      </Title>
      <TextInput
        placeholder="Filter"
        value={filter}
        onChange={(e) => setFilter((e.target.value || "").toLowerCase())}
      />
      <List mt={15} style={{ listStyle: "none" }}>
        {isLoading &&
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((x) => (
            <Skeleton key={x} height={20} width={250} mb={10} />
          ))}
        {!isLoading &&
          data
            .filter((x: any) => {
              if (!filter) {
                return true;
              }
              return (
                (x.abbreviation || "").toLowerCase().includes(filter) ||
                (x.name || "").toLowerCase().includes(filter)
              );
            })
            .map((x: any) => (
              <List.Item mb={10} key={x.id}>
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <Text style={{ width: 50, marginRight: 10 }} align="left">
                    {x.abbreviation}
                  </Text>
                  <Text style={{ flex: 1, marginRight: 2 }} align="left">
                    {x.name}
                  </Text>
                  <Link href={`/position/${x.id}`} passHref>
                    <ActionIcon color="blue" size="sm" ml="auto" mr={0}>
                      <IconCaretRight size={20} />
                    </ActionIcon>
                  </Link>
                </div>
              </List.Item>
            ))}
      </List>
    </MainLayout>
  );
};

export default Home;
