import React, { useMemo, useState } from "react";
import type { NextPage } from "next";
import MainLayout from "@c/Layout";
import { Skeleton, Text, Collapse, Anchor } from "@mantine/core";
import { IconArrowDownCircle, IconId } from "@tabler/icons";
import { useRouter } from "next/router";
import { useCompanyById } from "@c/Company/db";
import Head from "next/head";
import ReportButton from "@c/ReportButton/ReportButton";
import MoreInfoButton from "@c/MoreInfoButton/MoreInfoButton";
import CompanySection from "@c/Company/CompanySection";
import CompanyLayoffHistoryLineChart from "@c/Chart/CompanyLayoffHistoryLineChart";
import Card from "@c/Card/Card";
import CsuitSection from "@c/Csuit/CsuitSection";
import SubCard from "@c/Subsidiaries/SubCard";
import ReportedPipCard from "@c/Pip/ReportedPipCard";
import FreezeCard from "@c/Freeze/FreezeCard";

const CompanyPg: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: company, isLoading } = useCompanyById(id as string);
  return (
    <MainLayout>
      <Head>
        <title>
          Layoff watch | {isLoading ? "Company" : company.name} Info
        </title>
      </Head>
      {isLoading ? (
        <Skeleton height="300px" />
      ) : (
        <CompanySection {...company} hasLink={false} />
      )}
      <div style={{ height: 15, width: 1 }} />
      {isLoading ? (
        <Skeleton />
      ) : (
        <CompanyLayoffHistoryLineChart id={company.id} />
      )}
      <div style={{ height: 15, width: 1 }} />
      {isLoading ? (
        <Skeleton height="200px" />
      ) : (
        <ExecCard csuit_role={company.csuit_role} />
      )}
      <div style={{ height: 15, width: 1 }} />
      {isLoading ? (
        <Skeleton height="200px" />
      ) : (
        <ReportedPipCard company_id={company.id} />
      )}

      <div style={{ height: 15, width: 1 }} />
      {isLoading ? (
        <Skeleton height="200px" />
      ) : (
        <FreezeCard company_id={company.id} />
      )}
      <div style={{ height: 15, width: 1 }} />
      {isLoading ? (
        <Skeleton height="100px" />
      ) : (
        <SubCard company_id={company.id} />
      )}
      <div style={{ height: 15, width: 1 }} />
      {!isLoading && <MoreInfoButton id={id as string} type="layoff" />}
      {!isLoading && <ReportButton id={id as string} type="layoff" />}
    </MainLayout>
  );
};

const ExecCard = ({ csuit_role }: { csuit_role?: any[] }) => {
  const [open, setopen] = useState(false);
  const res = useMemo(() => {
    if (!csuit_role || csuit_role.length <= 0) {
      return null;
    }

    const data: { current: any[]; past: any[] } = {
      current: [],
      past: [],
    };
    for (let i = 0; i < csuit_role.length; i++) {
      const item = {
        start: csuit_role[i].start,
        end: csuit_role[i].end,
        ...csuit_role[i].csuit,
        role: csuit_role[i].role,
      };
      if (!csuit_role[i].start || (csuit_role[i].start && !csuit_role[i].end)) {
        data.current.push(item);
      } else {
        data.past.push(item);
      }
    }

    return data;
  }, [csuit_role]);

  if (res === null) {
    return (
      <Card isSmall title="Company Execs" startIcon={<IconId />}>
        <Text>No info about execs found</Text>
      </Card>
    );
  }

  return (
    <Card
      title={
        res.current.length >= 1
          ? "Current Execs"
          : res.past.length >= 1
          ? "Past Execs"
          : "Company Execs"
      }
    >
      {res.current.map((csuit: any) => (
        <CsuitSection key={csuit.id} {...csuit} />
      ))}
      {res.past.length >= 1 && res.current.length >= 1 && (
        <Text
          size="xl"
          style={{ alignSelf: "baseline", marginTop: 12 }}
          color="dimmed"
        >
          Past Execs
        </Text>
      )}
      <Collapse
        in={res.current.length <= 0 || open}
        style={{ width: "100%", paddingLeft: 5 }}
      >
        {res.past.map((csuit: any) => (
          <CsuitSection key={csuit.id} {...csuit} />
        ))}
      </Collapse>
      {res.past.length >= 1 && res.current.length >= 1 && (
        <Anchor onClick={() => setopen(!open)}>
          <IconArrowDownCircle
            style={{ transform: `rotate(${open ? 180 : 0}deg)` }}
          />
        </Anchor>
      )}
    </Card>
  );
};

export default CompanyPg;
