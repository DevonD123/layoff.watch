import React, { useState, useRef } from "react";
import type { NextPage } from "next";
import MainLayout from "@c/Layout";
import { Title, Text, TextInput, Skeleton } from "@mantine/core";
import Head from "next/head";
import { usePositionsById } from "@c/Position/db";
import { useRouter } from "next/router";
import MoreInfoButton from "@c/MoreInfoButton/MoreInfoButton";
import ReportButton from "@c/ReportButton/ReportButton";
import Feed, { IPageData, PER_PG } from "@c/Layoff/Feed";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";

const Home: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [filter, setFilter] = useState("");
  const { data, isLoading } = usePositionsById(id as string);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchPg = async ({ pageParam = 1 }): Promise<IPageData> => {
    const { data, error, count } = await supabaseClient
      .rpc(
        "position_filtered_feed",
        { p_id: id as string, f: filter || "" },
        { count: "exact" }
      )
      .range((pageParam - 1) * PER_PG, pageParam * PER_PG);
    if (error) {
      throw error;
    }
    const res: any[] = data.map((x) => ({
      ...x,
      company: {
        name: x.company_name,
        ticker: x.company_ticker,
        logo_url: x.company_logo_url,
        uploaded_logo_key: x.uploaded_logo_key,
        id: x.company_id,
      },
    }));
    return { items: res, total: count || 0 };
  };

  return (
    <MainLayout>
      <Head>
        <title>Layoff watch | Position {!isLoading && data.name}</title>
      </Head>
      {isLoading ? (
        <Skeleton width="90%" style={{ margin: "0 auto" }} />
      ) : (
        <Title order={2} align="center">
          {data.abbreviation} {data.name}
        </Title>
      )}
      {isLoading ? (
        <Skeleton width="90%" height={100} style={{ margin: "0 auto" }} />
      ) : (
        <Text color="dimmed" align="center" mb={15} mt={5}>
          {data.description || "No description added"}
        </Text>
      )}
      <TextInput
        ref={inputRef}
        placeholder="Filter ~ company name, ticker & report title"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            return setFilter(inputRef.current?.value || "");
          }
        }}
        onBlur={(e) => setFilter(inputRef.current?.value || "")}
      />
      <Feed
        cacheKey="positionFeed"
        cacheObj={{ id: id as string, filter }}
        fetchPg={fetchPg}
      />
      {!isLoading && <MoreInfoButton id={id as string} type="position" />}
      {!isLoading && <ReportButton id={id as string} type="position" />}
    </MainLayout>
  );
};

export default Home;
