import React from 'react';
import { useState } from 'react';
import type { NextPage } from 'next';
import MainLayout, { ContentWithSidebar } from '@c/Layout';
import { Title } from '@mantine/core';
import Head from 'next/head';
import AddExecButton from '@c/AddExecButton/AddExecButton';
import { useAllCSuitSummary } from '@c/Csuit/db';
import CsuitSummaryListItem from '@c/Csuit/CsuitSummaryListItem';
import List, {
  LoadingListItem,
  StyledListContainer,
  ListFilterInput,
} from '@c/List';
import constants from '@h/constants';

const ExecHome: NextPage = () => {
  const { data, isLoading } = useAllCSuitSummary();
  const [filter, setFilter] = useState('');
  const [input, setInput] = useState('');

  return (
    <MainLayout>
      <Head>
        <title>{constants.SITE_NAME} | Executives</title>
      </Head>
      <ContentWithSidebar>
        <StyledListContainer>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
              position: 'sticky',
              //position:'-webkit-sticky'
            }}
          >
            <Title order={2} align="left">
              Executives{' '}
            </Title>
            <AddExecButton />
          </div>
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
            data &&
            data.length >= 1 &&
            data.map((x: any) => (
              <CsuitSummaryListItem filter={filter} key={x.id} {...x} />
            ))}
        </List>
      </ContentWithSidebar>
    </MainLayout>
  );
};

export default ExecHome;
