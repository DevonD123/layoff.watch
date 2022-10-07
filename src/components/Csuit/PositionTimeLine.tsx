import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { ThemeIcon, Text, Avatar, Timeline, Card } from '@mantine/core';
import moment from 'moment';
import { useLayoffsBetween } from '@c/Layoff/db';
import {
  IconSnowflake,
  IconFlame,
  IconChartBar,
  IconEdit,
  IconCoin,
} from '@tabler/icons';
import { useInternalUser } from '@h/context/userContext';
import constants from '@h/constants';
import VerifiedBadge from '@c/Verified/VerifiedBadge';
import getImage from '@h/getImage';
import Company from 'pages/admin/company';

const ClickableEdit = styled(IconEdit)`
  cursor: pointer;
  transition: 300ms;
  &:hover {
    opacity: 0.7;
  }
`;

type Props = { csuit_id: string; roles: any; bonusArr: any[] };

interface ITimelineData {
  id: string;
  company_id: string;
  title?: string;
  url?: string;
  timeSpan?: string;
  extra?: string;
  extraColor?: string;
  icon?: JSX.Element;
  isPosition?: boolean;
  amount?: number;
  companyName?: string;
}

function getData(
  type: number,
  isCompleted: boolean,
  amount?: number,
  percent?: number,
  companyName?: string
) {
  if (type === 1) {
    return {
      icon: (
        <ThemeIcon color="red" size={18} radius="xl">
          <IconFlame size={18} />
        </ThemeIcon>
      ),
      title: `Layoffs ${companyName && `@ ${companyName}`}`,
      extra: amount && `${amount} laid off`,
      amount,
      companyName,
      extraColor: (amount && getTextColorByCount(amount)) || undefined,
    };
  }
  if (type === 5) {
    if (isCompleted) {
      return {
        icon: (
          <ThemeIcon color="green" size={18} radius="xl">
            <IconChartBar size={18} />
          </ThemeIcon>
        ),
        title: `PIP canceled ${companyName && `@ ${companyName}`}`,
        extra: undefined,
      };
    }

    return {
      icon: (
        <ThemeIcon color="orange" size={18} radius="xl">
          <IconChartBar size={18} />
        </ThemeIcon>
      ),
      title: `PIP started ${companyName && `@ ${companyName}`}`,
      extra: percent && `target ${percent}%`,
    };
  }

  if (isCompleted) {
    return {
      icon: (
        <ThemeIcon color="green" size={18} radius="xl">
          <IconSnowflake size={18} />
        </ThemeIcon>
      ),
      title: `Hiring Reinstated ${companyName && `@ ${companyName}`}`,
      extra: undefined,
    };
  }
  return {
    icon: (
      <ThemeIcon color="blue" size={18} radius="xl">
        <IconSnowflake size={18} />
      </ThemeIcon>
    ),
    title: `Hiring Freeze ${companyName && `@ ${companyName}`}`,
    extra: undefined,
  };
}

const PositionTimeLine = (props: Props) => {
  const { isEditMode, setSelectedCsuitRoleId } = useInternalUser();
  const companies = props.roles.map((x: any) => x.company_id);
  const orderedDates =
    props.roles && props.roles.length >= 1
      ? props.roles.reduce((a: any, b: any) =>
          Date.parse(a.start) > Date.parse(b.start) ? b.start : a.start
        )
      : [];
  const { data } = useLayoffsBetween(orderedDates?.start, companies);
  const results: ITimelineData[] = useMemo(() => {
    const formatter = new Intl.NumberFormat(`en-US`, {
      currency: `USD`,
      style: 'currency',
    });
    const layoffsMapped = (data || []).map((x: any) => ({
      ...x,
      ...getData(x.type, x.is_completed, x.number, x.percent, x.company?.name),
      start: x.layoff_date,
      timeSpan: moment(x.layoff_date).format(constants.DATE_FORMAT),
      company_id: x.company_id,
      verified: x.verified,
    }));
    const rolesMapped = (props.roles || []).map((x: any) => ({
      id: x.id,
      title: `Started as ${x.role} @ ${x.company.name}`,
      url: getImage({
        url: x.company.uploaded_logo_key,
        fallbackUrl: x.company.logo_url,
        size: 30,
      }),
      timeSpan: `${moment(x.start).format(constants.DATE_FORMAT)} ${
        x.end ? '-' : ''
      } ${x.end ? moment(x.end).format(constants.DATE_FORMAT) : ''}`,
      start: x.start,
      company_id: x.company_id,
      isPosition: true,
      companyName: x.company?.name,
      verified: x.verified,
    }));
    const bonusMapped = (props.bonusArr || []).map((x: any) => ({
      id: x.id,
      title: `${
        formatter.format(x.amount).split('.')[0]
      } USD recived on ${moment(x.start).format(constants.DATE_FORMAT)} from ${
        x.company?.name
      }`,
      isBonus: true,
      start: x.date,
      verified: x.verified,
    }));

    let lastcompany_id = '';
    const sortedArr = [...layoffsMapped, ...rolesMapped, ...bonusMapped]
      .sort(
        (a: any, b: any) =>
          new Date(b.start).getTime() - new Date(a.start).getTime()
      )
      .reverse()
      .filter((x) => {
        if (x.isBonus) {
          return true;
        }
        if (x.isPosition) {
          lastcompany_id = x.company_id;
          return true;
        }

        return x.company_id === lastcompany_id;
      })
      .reverse();

    return [{ id: '__NA__', title: 'Current' }, ...sortedArr];
  }, [props.roles, data, props.bonusArr]);

  if (results.length <= 1) {
    return (
      <Text
        sx={{ marginTop: 50, marginBottom: 50 }}
        align="center"
        color="dimmed"
      >
        No role related data yet :(
      </Text>
    );
  }

  return (
    <>
      <Timeline style={{ margin: '25px auto', maxWidth: 500 }}>
        {results.map((x: any) => {
          if (x.isBonus) {
            return (
              <Timeline.Item
                key={x.id}
                title={
                  <Text component="span" color="dimmed" size="xs">
                    {x.title}{' '}
                    {isEditMode && (
                      <ClickableEdit
                        onClick={() => setSelectedCsuitRoleId(x.id)}
                        size={14}
                      />
                    )}
                    <VerifiedBadge verified={x.verified} isSmall />
                  </Text>
                }
                bulletSize={8}
                bullet={
                  <ThemeIcon color="dark" size={20} radius="xl">
                    <IconCoin size={20} />
                  </ThemeIcon>
                }
              />
            );
          }
          return (
            <Timeline.Item
              key={x.id}
              title={
                <span>
                  {x.title}{' '}
                  <Text component="span" color="dimmed">
                    {isEditMode && x.id !== '__NA__' && (
                      <ClickableEdit
                        onClick={() => setSelectedCsuitRoleId(x.id)}
                        size={14}
                      />
                    )}
                  </Text>
                  <VerifiedBadge verified={x.verified} isSmall />
                </span>
              }
              bulletSize={x.url ? 30 : x.icon ? 18 : 10}
              bullet={
                x.url ? <Avatar size={30} radius="xl" src={x.url} /> : x.icon
              }
            >
              {x.timeSpan && (
                <Text color="dimmed" size="sm">
                  {x.timeSpan}
                  {x.extra && (
                    <>
                      &nbsp;-&nbsp;
                      <Text
                        size="sm"
                        color={x.extraColor || 'dimmed'}
                        component="span"
                      >
                        {x.extra}
                      </Text>
                    </>
                  )}
                </Text>
              )}
            </Timeline.Item>
          );
        })}
      </Timeline>
      <Totals data={results} />
    </>
  );
};

interface IResultData {
  [key: string]: {
    total: number;
    name: string;
  };
}
const Totals = ({ data }: { data: ITimelineData[] }) => {
  const resultData = useMemo(() => {
    const res: IResultData = {};
    for (let i = 0; i < data.length; i++) {
      if (data[i].companyName && data[i].company_id) {
        const mapVal = res[data[i].company_id];
        res[data[i].company_id] = {
          total: (mapVal?.total || 0) + (data[i].amount || 0),
          name: mapVal?.name || data[i].companyName || '',
        };
      }
    }
    return res;
  }, [data]);

  return (
    <Card
      sx={(theme) => ({
        width: 300,
        margin: '10px auto 25px auto',
        background: theme.colors.gray[2],
      })}
    >
      {Object.keys(resultData).map((key) => (
        <Text key={key} color="dark">
          <Text
            component="span"
            color={getTextColorByCount(resultData[key].total)}
          >
            {resultData[key].total} layoffs
          </Text>{' '}
          @ {resultData[key].name} total
        </Text>
      ))}
    </Card>
  );
};

function getTextColorByCount(count: number) {
  if (count === 0) {
    return 'green';
  }
  if (count <= 99) {
    return 'yellow';
  }
  if (count <= 499) {
    return 'orange';
  }
  return 'red';
}

export default PositionTimeLine;
