import React from "react";
import type { NextPage } from "next";
import MainLayout from "@c/Layout";
import { Skeleton, Text, Title, Anchor, Button } from "@mantine/core";
import { useRouter } from "next/router";
import { useLayoutPgData } from "@c/Layoff/db";
import { IconExternalLink, IconInfoCircle } from "@tabler/icons";
import Link from "next/link";
import PositionDisplayLinkList from "@c/Position/PositionDisplayLinkList";
import CompanySection from "@c/Company/CompanySection";
import CsuitSection from "@c/Csuit/CsuitSection";
import Head from "next/head";
import moment from "moment";
import ReportButton from "@c/ReportButton/ReportButton";
import MoreInfoButton from "@c/MoreInfoButton/MoreInfoButton";
import CompanyLayoffHistoryLineChart from "@c/Chart/CompanyLayoffHistoryLineChart";

const Home: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading } = useLayoutPgData(id as string);
  return (
    <MainLayout>
      <Head>
        <title>
          Layoff watch | {isLoading ? "Company" : data.company.name} layoffs
          reported
        </title>
      </Head>
      {isLoading ? <Skeleton /> : <Title order={2}>{data.title}</Title>}
      {isLoading ? (
        <Skeleton />
      ) : (
        <Text size="xl" color="red">
          {data.number} Employees Laid off
          {data.percent && (
            <Text color="dimmed" size="sm" component="span">
              {" "}
              ({data.percent}% of workforce)
            </Text>
          )}
        </Text>
      )}
      {isLoading ? (
        <Skeleton />
      ) : (
        <Text size="md" color="dimmed">
          Affected positions:{" "}
          {!isLoading && data.position_layoff.length <= 0 && "None reported"}
        </Text>
      )}
      {isLoading ? (
        <Skeleton />
      ) : (
        <PositionDisplayLinkList
          data={
            data.position_layoff.length <= 0
              ? []
              : data.position_layoff.map(({ position }: { position: any }) => ({
                  id: position.id,
                  abbreviation: position.abbreviation,
                  name: position.name,
                }))
          }
        />
      )}

      {isLoading ? (
        <Skeleton height={200} width="100%" />
      ) : (
        <CompanySection {...data.company}>
          <div style={{ marginTop: 20 }}>
            {data.csuit_layoff.map((cl: any) => (
              <CsuitSection key={cl.csuit.id} {...cl.csuit} />
            ))}
          </div>
        </CompanySection>
      )}
      <div style={{ height: 20, width: 20 }} />
      {isLoading ? (
        <Skeleton />
      ) : !data.extra_info ? null : (
        <Text>
          Reported {moment(data.layoff_date).startOf("day").fromNow()}
        </Text>
      )}

      {isLoading ? (
        <Skeleton />
      ) : (
        <CompanyLayoffHistoryLineChart id={data.company_id} />
      )}
      <div style={{ height: 15, width: 1 }} />
      {isLoading ? (
        <Skeleton />
      ) : !data.extra_info ? null : (
        <Text>
          <IconInfoCircle size={14} />
          {data.extra_info}
        </Text>
      )}
      <div style={{ height: 15, width: 1 }} />
      {isLoading ? (
        <Skeleton />
      ) : !data.source ? null : (
        <Link href={data.source} passHref>
          <Anchor target="_blank">
            <IconExternalLink size={14} />
            Source: {data.source_display || data.source}
          </Anchor>
        </Link>
      )}
      <div style={{ height: 15, width: 1 }} />

      {!isLoading && <MoreInfoButton id={id as string} type="layoff" />}
      {!isLoading && <ReportButton id={id as string} type="layoff" />}
    </MainLayout>
  );
};

export default Home;
