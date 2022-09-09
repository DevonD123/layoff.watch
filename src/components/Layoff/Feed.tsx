import React, { useMemo, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import {
  List,
  Skeleton,
  Text,
  ThemeIcon,
  createStyles,
  Avatar,
  ActionIcon,
} from "@mantine/core";
import {
  IconChartBar,
  IconFlame,
  IconSnowflake,
  IconCaretRight,
} from "@tabler/icons";
import { ReportType } from "./types";
import moment from "moment";
import Link from "next/link";

type Props = {
  fetchPg?: (obj: { pageParam?: number }) => Promise<IPageData>;
  cacheKey?: string;
  cacheObj?: any;
};

const useStyles = createStyles((theme, _params, getRef) => ({
  inlinetwo: {
    display: "inline-block",
    width: "50%",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  border: {
    borderBottom: `1px solid ${theme.colors.gray[2]}`,
  },
  rows: {
    display: "flex",
    flexDirection: "column",
    // maxWidth: "50%",
  },
  itemRow: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "100%",
  },
  item: {
    width: "100%",
    minWidth: 250,
  },
  ellipsis: {
    maxWidth: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  icon: { position: "absolute", bottom: -5, right: -5 },
  avatar: {
    height: 50,
    width: 50,
  },
  avatarWrapper: {
    position: "relative",
  },
  spaceBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  alignTop: {
    marginBottom: "auto",
    marginTop: 0,
  },
  w50: {
    maxWidth: "50%",
  },
  w100: {
    maxWidth: "100%",
  },
}));

export const PER_PG = 50;
const fetchFeed = async ({ pageParam = 1 }): Promise<IPageData> => {
  const { data, error, count } = await supabaseClient
    .from("layoff")
    .select("*,company(*)", { count: "exact" })
    .order("layoff_date", { ascending: false })
    .range((pageParam - 1) * PER_PG, pageParam * PER_PG);
  if (error) {
    throw error;
  }
  return { items: data, total: count || 0 };
};

const IconMap = {
  [ReportType.Layoff]: {
    color: "red",
    icon: IconFlame,
  },
  [ReportType.Freeze]: {
    color: "blue",
    icon: IconSnowflake,
  },
  [ReportType.Pip]: {
    color: "orange",
    icon: IconChartBar,
  },
};

export interface IPageData {
  items: any[];
  total: number;
}
const Feed = ({ fetchPg, cacheKey = "layoff_feed", cacheObj = {} }: Props) => {
  const { classes } = useStyles();
  const { data, isLoading, isFetching, fetchNextPage, hasNextPage, error } =
    useInfiniteQuery(
      [cacheKey, cacheObj],
      typeof fetchPg === "function" ? fetchPg : fetchFeed,
      {
        getNextPageParam: (lastPage: IPageData, pages: IPageData[]) => {
          const maxPg = lastPage.total / PER_PG;
          const nextPg = pages.length + 1;
          if (nextPg <= maxPg) {
            return nextPg;
          }
          return undefined;
        },
      }
    );

  /**
   * @param report (layoff table)
   */
  const getIcon = (
    type: ReportType,
    companyName?: string,
    companyLogo?: string
  ) => {
    const Icon = IconMap[type].icon;
    return (
      <div className={classes.avatarWrapper}>
        <Avatar
          radius="xl"
          className={classes.avatar}
          src={companyLogo}
          alt={companyName}
        />
        <div className={classes.icon}>
          <ThemeIcon color={IconMap[type].color} size={24} radius="xl">
            <Icon size={24} />
          </ThemeIcon>
        </div>
      </div>
    );
  };

  interface IText {
    number: string | null;
  }
  /**
   * @param report (layoff table)
   */
  const getListItemContent = (report: any) => {
    const text: IText = {
      number: null,
    };
    if (report.type === ReportType.Pip) {
      text.number = `${report.percent}% target`;
    }
    if (
      report.type === ReportType.Layoff &&
      typeof report.number === "number"
    ) {
      text.number = `${report.number.toLocaleString()} laid off`;
    }
    if (error) {
      console.error(error);
    }
    return (
      <div className={classes.item}>
        <div className={classes.itemRow}>
          <Text
            title={report.title}
            color="dark"
            size="lg"
            className={`${classes.w100} ${classes.ellipsis}`}
          >
            <b>{report.title}</b>
          </Text>
          <div className={classes.spaceBetween}>
            <Text
              color="dark"
              size="lg"
              className={`${classes.ellipsis} ${classes.alignTop} ${classes.w50}`}
              align="left"
              title={
                report.company.name + report.company.ticker
                  ? ` (${report.company.ticker})`
                  : ""
              }
            >
              {report.company.name}{" "}
              {report.company.ticker && (
                <Text color="dimmed" size="xs" align="left" component="span">
                  ({report.company.ticker})
                </Text>
              )}
            </Text>
            <div className={classes.inlinetwo}>
              <div className={classes.rows}>
                {text.number && (
                  <Text
                    color="dark"
                    size="xs"
                    className={classes.ellipsis}
                    align="right"
                    title={text.number}
                  >
                    {text.number}
                  </Text>
                )}

                <Text
                  color="dimmed"
                  size="xs"
                  className={classes.ellipsis}
                  align="right"
                  title={report.layoff_date}
                >
                  <i>
                    Affective {moment(report.layoff_date).format("M/d/yyyy")}
                  </i>
                </Text>
              </div>
            </div>
            <Link href={`/report/${report.id}`} passHref>
              <ActionIcon color="blue" size="sm">
                <IconCaretRight size={20} />
              </ActionIcon>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const result: any[] = useMemo(() => {
    if (
      !data ||
      !data.pages ||
      data.pages.length <= 0 ||
      data.pages[0].items.length <= 0
    ) {
      return [];
    }
    let res = data.pages[0].items;
    for (let i = 1; i < data.pages.length; i++) {
      res = res.concat(data.pages[i].items);
    }
    return res;
  }, [data]);

  /*
  https://www.youtube.com/watch?v=Hcuk3KbLAKo
  */
  useEffect(() => {
    // TODO add ref to tile and check how far that is from the top & use that in calc (so we can have expandable cards)
    const handlePg = async (e: any) => {
      const { scrollHeight, scrollTop, clientHeight } =
        e?.target?.scrollingElement;

      if (
        !isFetching &&
        hasNextPage &&
        scrollHeight - scrollTop <= clientHeight * 1.2
      ) {
        console.log("IS FETCHING");
        await fetchNextPage();
      }
    };
    document.addEventListener("scroll", handlePg);
    return () => document.removeEventListener("scroll", handlePg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Text mt={25} size="xl" align="center">
        Recent
      </Text>
      <List spacing="xs" size="sm" center>
        {isLoading &&
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((x: number) => (
            <LoadingLi key={x} />
          ))}

        {result.map((x, i) => {
          return (
            <List.Item
              className={classes.border}
              key={x.id}
              icon={getIcon(x.type, x.company.name, x.company.logo_url)}
            >
              {getListItemContent(x)}
            </List.Item>
          );
        })}

        {!isLoading &&
          isFetching &&
          [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((x: number) => (
            <LoadingLi key={x} />
          ))}
      </List>
      {!hasNextPage && (
        <Text align="center" color="dimmed" size="sm" mt={15} mb={25}>
          No more results
        </Text>
      )}
    </div>
  );
};

const LoadingLi = () => {
  return (
    <List.Item icon={<Skeleton radius="xl" width={50} height={50} />}>
      <Skeleton width={250} height={50} />
    </List.Item>
  );
};

export default Feed;
