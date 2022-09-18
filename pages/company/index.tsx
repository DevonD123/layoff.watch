import React, { useState } from "react";
import type { NextPage } from "next";
import MainLayout from "@c/Layout";
import {
  Skeleton,
  Text,
  Title,
  Stack,
  Grid,
  Avatar,
  Chip,
  TextInput,
  ActionIcon,
  createStyles,
} from "@mantine/core";
import { useRouter } from "next/router";
import Head from "next/head";
import { useMinimalCompanyList } from "@c/Company/db";
import Link from "next/link";
import { IconLink } from "@tabler/icons";
import moment from "moment";

const useStyles = createStyles((theme, _params, getRef) => ({
  noGap: {
    gap: 0,
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  border: {
    borderBottom: `1px solid ${theme.colors.gray[2]}`,
  },
  textOverflow: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

const Home: NextPage = () => {
  const { classes } = useStyles();
  const { data, isLoading } = useMinimalCompanyList();
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [hasPast, setHasPast] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  return (
    <MainLayout>
      <Head>
        <title>Layoff watch | recent layoffs reported</title>
      </Head>
      <Title order={3} align="center">
        Companies Layoffs
      </Title>
      <div style={{ display: "flex", marginBottom: 2 }}>
        <Chip
          checked={hasPast}
          onChange={(checked) => setHasPast(checked)}
          style={{ marginRight: 2 }}
        >
          past layoffs only
        </Chip>
        <Chip checked={isPublic} onChange={(checked) => setIsPublic(checked)}>
          Public
        </Chip>
      </div>
      <TextInput
        placeholder="microsoft"
        value={input}
        onChange={(e) => setInput(e.target.value.toLowerCase())}
        onBlur={() => setText(input)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setText(input);
          }
        }}
        style={{ marginBottom: "1em" }}
      />

      {data &&
        data.length >= 1 &&
        data
          .filter((x: any) => {
            if (hasPast && !x.layoff_date) {
              return false;
            }
            if (isPublic && !x.ticker) {
              return false;
            }
            return (
              !text ||
              x.name.toLowerCase().includes(text) ||
              (x.ticker && x.ticker.toLowerCase().includes(text))
            );
          })
          .map((x: any) => (
            <Grid key={x.company_id} className={classes.border}>
              <Grid.Col span={2} className={classes.center}>
                <Avatar src={x.logo_url} alt={x.name}></Avatar>
              </Grid.Col>
              <Grid.Col span={5}>
                <Stack spacing="xs" className={classes.noGap}>
                  <Text size="sm" className={classes.textOverflow}>
                    {x.name}
                  </Text>
                  <Text size="xs" color="dimmed">
                    {x.ticker}
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={4}>
                <Stack spacing="xs" className={classes.noGap}>
                  {x.amount ? (
                    <Text size="sm" color="red">
                      {x.amount} laid off
                    </Text>
                  ) : (
                    <Text size="sm" color="green">
                      No Layoffs yet
                    </Text>
                  )}
                  {x.layoff_date && (
                    <Text size="xs" color="dimmed">
                      {moment(x.layoff_date).startOf("day").fromNow()}
                    </Text>
                  )}
                </Stack>
              </Grid.Col>
              <Grid.Col span={1} className={classes.center}>
                <Link href={`/company/${x.company_id}`} passHref>
                  <ActionIcon
                    size="xs"
                    component="a"
                    variant="light"
                    color="blue"
                  >
                    <IconLink />
                  </ActionIcon>
                </Link>
              </Grid.Col>
            </Grid>
          ))}
    </MainLayout>
  );
};

export default Home;
