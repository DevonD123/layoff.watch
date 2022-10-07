import React from 'react';
import type { NextPage } from 'next';
import MainLayout from '@c/Layout';
import { Title, Text, Skeleton, Avatar, Group } from '@mantine/core';
import Head from 'next/head';
import { useRouter } from 'next/router';
import MoreInfoButton from '@c/MoreInfoButton/MoreInfoButton';
import ReportButton from '@c/ReportButton/ReportButton';
import { useCsuitById } from '@c/Csuit/db';
import PositionTimeLine from '@c/Csuit/PositionTimeLine';
import getImage from '@h/getImage';
import VerifiedBadge from '@c/Verified/VerifiedBadge';
import AddRoleButton from '@c/AddRoleButton/AddRoleButton';
import AddBonusButton from '@c/AddBonusButton/AddBonusButton';
import constants from '@h/constants';

const Home: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading } = useCsuitById(id as string);
  return (
    <MainLayout>
      <Head>
        <title>
          {constants.SITE_NAME} | Exectuives {!isLoading && data.name}
        </title>
      </Head>
      {isLoading ? (
        <Skeleton width="100px" height="100px" style={{ margin: '0 auto' }} />
      ) : (
        <Avatar
          style={{ width: 100, height: 100, margin: '0 auto' }}
          src={getImage({ fallbackUrl: data.img_url || '' })}
          alt={data.name}
        />
      )}
      {isLoading ? (
        <Skeleton width="90%" style={{ margin: '0 auto' }} />
      ) : (
        <>
          <VerifiedBadge {...data} />
          <Title order={2} align="center">
            {data.name}
          </Title>
        </>
      )}
      {isLoading ? (
        <Skeleton width="90%" height={100} style={{ margin: '0 auto' }} />
      ) : (
        <>
          <Text color="dimmed" align="center" mb={15} mt={5}>
            {data.bio || 'No bio added'}
          </Text>
          <Group position="center">
            <AddBonusButton id={id as string} name={data.name} />
            <AddRoleButton id={id as string} name={data.name} />
          </Group>
        </>
      )}
      {isLoading ? (
        <Skeleton width="90%" height={100} style={{ margin: '0 auto' }} />
      ) : (
        <PositionTimeLine
          csuit_id={id as string}
          roles={data.csuit_role}
          bonusArr={data.csuit_bonus}
        />
      )}

      {!isLoading && <MoreInfoButton id={id as string} type="position" />}
      {!isLoading && <ReportButton id={id as string} type="position" />}
    </MainLayout>
  );
};

export default Home;
