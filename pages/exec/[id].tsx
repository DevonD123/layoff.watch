import React from "react";
import type { NextPage } from "next";
import MainLayout from "@c/Layout";
import { Title, Text, Skeleton, Avatar, Group, Button } from "@mantine/core";
import Head from "next/head";
import { useRouter } from "next/router";
import MoreInfoButton from "@c/MoreInfoButton/MoreInfoButton";
import ReportButton from "@c/ReportButton/ReportButton";
import { useCsuitById } from "@c/Csuit/db";
import PositionTimeLine from "@c/Csuit/PositionTimeLine";
import getImage from "@h/getImage";
import VerifiedBadge from "@c/Verified/VerifiedBadge";

const Home: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading } = useCsuitById(id as string);

  return (
    <MainLayout>
      <Head>
        <title>Layoff watch | Exeectuives {!isLoading && data.name}</title>
      </Head>
      {isLoading ? (
        <Skeleton width="100px" height="100px" style={{ margin: "0 auto" }} />
      ) : (
        <Avatar
          style={{ width: 100, height: 100, margin: "0 auto" }}
          src={getImage({ fallbackUrl: data.img_url || "" })}
          alt={data.name}
        />
      )}
      {isLoading ? (
        <Skeleton width="90%" style={{ margin: "0 auto" }} />
      ) : (
        <>
          <VerifiedBadge {...data} />
          <Title order={2} align="center">
            {data.name}
          </Title>
        </>
      )}
      {isLoading ? (
        <Skeleton width="90%" height={100} style={{ margin: "0 auto" }} />
      ) : (
        <>
          <Text color="dimmed" align="center" mb={15} mt={5}>
            {data.bio || "No bio added"}
          </Text>
          <Group position="center">
            <Button size="xs">Report a bonus</Button>
            <Button size="xs">Add a role</Button>
          </Group>
        </>
      )}
      {isLoading ? (
        <Skeleton width="90%" height={100} style={{ margin: "0 auto" }} />
      ) : (
        <PositionTimeLine csuit_id={id as string} roles={data.csuit_role} />
      )}

      {!isLoading && <MoreInfoButton id={id as string} type="position" />}
      {!isLoading && <ReportButton id={id as string} type="position" />}
    </MainLayout>
  );
};

export default Home;
