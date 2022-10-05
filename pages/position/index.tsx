import React from 'react';
import { useState } from 'react';
import type { NextPage } from 'next';
import MainLayout, { ContentWithSidebar } from '@c/Layout';
import { Title, Text } from '@mantine/core';
import Head from 'next/head';
import { useAllPositions } from '@c/Position/db';
import List, {
  LoadingListItem,
  StyledListContainer,
  ListFilterInput,
  ListItem,
} from '@c/List';

const Home: NextPage = () => {
  const [filter, setFilter] = useState('');
  const [input, setInput] = useState('');
  const { data, isLoading } = useAllPositions();
  return (
    <MainLayout>
      <Head>
        <title>Layoff watch | Positions</title>
      </Head>
      <ContentWithSidebar>
        <StyledListContainer>
          <Title order={2} align="center">
            Positions
          </Title>
          <ListFilterInput
            placeholder="Filter"
            value={input}
            onBlur={(e) => setFilter(input)}
            onChange={(e) => setInput((e.target.value || '').toLowerCase())}
            onKeyDown={(e) => {
              if (e.key == 'Enter') {
                (e.target as HTMLInputElement).blur();
              }
            }}
          />
        </StyledListContainer>
        <List>
          {isLoading &&
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((x) => (
              <LoadingListItem key={x} />
            ))}
          {!isLoading &&
            data
              .filter((x: any) => {
                if (!filter) {
                  return true;
                }
                return (
                  (x.abbreviation || '').toLowerCase().includes(filter) ||
                  (x.name || '').toLowerCase().includes(filter)
                );
              })
              .map((x: any) => (
                <ListItem
                  key={x.id}
                  rightBottom={<></>}
                  left={
                    <div
                      style={{
                        display: 'flex',
                      }}
                    >
                      <Text style={{ width: 50, marginRight: 10 }} align="left">
                        {x.abbreviation}
                      </Text>
                      <Text style={{ flex: 1, marginRight: 2 }} align="left">
                        {x.name}
                      </Text>
                    </div>
                  }
                  link={`/position/${x.id}`}
                />
              ))}
        </List>
      </ContentWithSidebar>
    </MainLayout>
  );
};

export default Home;
