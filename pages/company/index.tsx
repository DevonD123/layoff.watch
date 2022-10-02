import React, { useState } from "react";
import type { NextPage } from "next";
import moment from "moment";
import MainLayout, { ContentWithSidebar } from "@c/Layout";
import { Text, Title, Stack, Avatar, Chip, } from "@mantine/core";
import Head from "next/head";
import { useMinimalCompanyList } from "@c/Company/db";
import List, {
  ListItem,
  LoadingListItem,
  StyledListContainer,
  ListFilterInput,
} from "@c/List";
import { IconBuilding } from "@tabler/icons";

const Home: NextPage = () => {
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
      <Title order={2} align="center">
        Companies
      </Title>
      <ContentWithSidebar>
        <StyledListContainer>
          <div style={{ display: "flex", marginBottom: 2 }}>
            <Chip
              checked={hasPast}
              onChange={(checked) => setHasPast(checked)}
              style={{ marginRight: 2 }}
            >
              past layoffs only
            </Chip>
            <Chip
              checked={isPublic}
              onChange={(checked) => setIsPublic(checked)}
            >
              Public
            </Chip>
          </div>
          <ListFilterInput
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
        </StyledListContainer>
        <List>
          {isLoading &&
            [1, 2, 3, 4, 5, 6, 7, 8].map((x) => <LoadingListItem key={x} />)}
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
                <ListItem
                  key={x.company_id}
                  link={`/company/${x.company_id}`}
                  avatar={<Avatar src={x.logo_url} alt={x.name}><IconBuilding size={24} /></Avatar>}
                  left={
                    <Stack spacing="xs">
                      <Text size="sm">{x.name}</Text>
                      <Text size="xs" color="dimmed">
                        {x.ticker}
                      </Text>
                    </Stack>
                  }
                  rightTop={
                    x.amount ? (
                      <Text size="sm" color="red">
                        {x.amount} laid off
                      </Text>
                    ) : (
                      <Text size="sm" color="green">
                        No Layoffs yet
                      </Text>
                    )
                  }
                  rightBottom={
                    x.layoff_date
                      ? moment(x.layoff_date).startOf("day").fromNow()
                      : ""
                  }
                />
              ))}
        </List>
      </ContentWithSidebar>
    </MainLayout>
  );
};

export default Home;
/**
 * 
 * <Grid key={x.company_id} className={classes.border}>
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
                      <IconCaretRight />
                    </ActionIcon>
                  </Link>
                </Grid.Col>
              </Grid>
 * 
 */
