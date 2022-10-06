import React, { useMemo, useEffect } from 'react';
import { Text, ThemeIcon, Avatar } from '@mantine/core';
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';
import {
  IconChartBar,
  IconFlame,
  IconSnowflake,
  IconBuilding,
} from '@tabler/icons';
import moment from 'moment';
import { ReportType } from './types';
import List, { ListItem, LoadingListItem, AvatarWrapper } from '@c/List';
import constants from '@h/constants';

type Props = {
  fetchPg?: (obj: { pageParam?: number }) => Promise<IPageData>;
  cacheKey?: string;
  cacheObj?: any;
};

export const PER_PG = 50;
const fetchFeed = async ({ pageParam = 1 }): Promise<IPageData> => {
  const { data, error, count } = await supabaseClient
    .from('layoff')
    .select('*,company(*)', { count: 'exact' })
    .order('layoff_date', { ascending: false })
    .range((pageParam - 1) * PER_PG, pageParam * PER_PG);
  if (error) {
    throw error;
  }
  return { items: data, total: count || 0 };
};

export const IconMap = {
  [ReportType.Layoff]: {
    color: 'red',
    icon: IconFlame,
  },
  [ReportType.Freeze]: {
    color: 'blue',
    icon: IconSnowflake,
  },
  [ReportType.Pip]: {
    color: 'orange',
    icon: IconChartBar,
  },
};

export interface IPageData {
  items: any[];
  total: number;
}
const Feed = ({ fetchPg, cacheKey = 'layoff_feed', cacheObj = {} }: Props) => {
  const { data, isLoading, isFetching, fetchNextPage, hasNextPage, error } =
    useInfiniteQuery(
      [cacheKey, cacheObj],
      typeof fetchPg === 'function' ? fetchPg : fetchFeed,
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
      <AvatarWrapper>
        <Avatar
          radius="xl"
          className="avatar"
          src={companyLogo}
          alt={companyName}
        >
          <IconBuilding size={45} />
        </Avatar>
        <div className="subIcon">
          <ThemeIcon color={IconMap[type].color} size={24} radius="xl">
            <Icon size={24} />
          </ThemeIcon>
        </div>
      </AvatarWrapper>
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
    if (report.type === ReportType.Pip && report.percent) {
      text.number = `${report.percent}% target`;
    }
    if (
      report.type === ReportType.Layoff &&
      typeof report.number === 'number' &&
      report.number >= 0
    ) {
      text.number = `${report.number.toLocaleString()} laid off`;
    }
    if (error) {
      console.error(error);
    }

    return (
      <ListItem
        key={report.id}
        avatar={getIcon(
          report.type,
          report.company.name,
          report.company.logo_url
        )}
        title={report.title}
        verified={report.verified}
        left={
          <span>
            {report.company.name}{' '}
            {report.company.ticker && (
              <Text color="dimmed" size="xs" align="left" component="span">
                ({report.company.ticker})
              </Text>
            )}
          </span>
        }
        rightTop={text.number || undefined}
        rightBottom={`Affective ${moment(report.layoff_date).format(
          constants.DATE_FORMAT
        )}`}
        link={`/report/${report.id}`}
      />
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
        await fetchNextPage();
      }
    };
    document.addEventListener('scroll', handlePg);
    return () => document.removeEventListener('scroll', handlePg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <List paged hasNext={hasNextPage}>
      {isLoading &&
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((x: number) => (
          <LoadingListItem key={x} />
        ))}

      {result.map((x, i) => getListItemContent(x))}

      {!isLoading &&
        isFetching &&
        [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((x: number) => (
          <LoadingListItem key={x} />
        ))}
    </List>
  );
};

export default Feed;
