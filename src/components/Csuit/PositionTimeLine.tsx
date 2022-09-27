import React, { useMemo } from "react";
import { ThemeIcon, Text, Avatar, Timeline, Button, Card } from "@mantine/core";
import moment from "moment";
import { useLayoffsBetween } from "@c/Layoff/db";
import { IconSnowflake, IconFlame, IconChartBar } from "@tabler/icons";

type Props = { csuit_id: string; roles: any };

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
  const companies = props.roles.map((x: any) => x.company_id);
  const orderedDates =
    props.roles && props.roles.length >= 1
      ? props.roles.reduce((a: any, b: any) =>
          Date.parse(a.start) > Date.parse(b.start) ? b.start : a.start
        )
      : [];
  //   const finalDate =
  //     orderedDates.length >= 1 && orderedDates[0].start
  //       ? orderedDates[0].start
  //       : null;
  const { data } = useLayoffsBetween(orderedDates?.start, companies);
  const results: ITimelineData[] = useMemo(() => {
    const layoffsMapped = (data || []).map((x: any) => ({
      ...x,
      ...getData(x.type, x.is_completed, x.number, x.percent, x.company?.name),
      start: x.layoff_date,
      timeSpan: moment(x.layoff_date).format("M/d/yyyy"),
      company_id: x.company_id,
    }));
    const rolesMapped = (props.roles || []).map((x: any) => ({
      id: x.id,
      title: `Started as ${x.role} @ ${x.company.name}`,
      url: x.company.logo_url,
      timeSpan: `${moment(x.start).format("M/d/yyyy")} ${x.end ? "-" : ""} ${
        x.end ? moment(x.end).format("M/d/yyyy") : ""
      }`,
      start: x.start,
      company_id: x.company_id,
      isPosition: true,
      companyName: x.company?.name,
    }));

    let lastcompany_id = "";
    const sortedArr = [...layoffsMapped, ...rolesMapped]
      .sort(
        (a: any, b: any) =>
          new Date(b.start).getTime() - new Date(a.start).getTime()
      )
      .reverse()
      .filter((x) => {
        if (x.isPosition) {
          lastcompany_id = x.company_id;
          return true;
        }

        return x.company_id === lastcompany_id;
      })
      .reverse();

    return [{ id: "__NA__", title: "Current" }, ...sortedArr];
  }, [props.roles, data]);

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
      <Timeline style={{ marginTop: 25, marginBottom: 25 }}>
        {results.map((x: any) => {
          return (
            <Timeline.Item
              key={x.id}
              title={x.title}
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
                        color={x.extraColor || "dimmed"}
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
          name: mapVal?.name || data[i].companyName || "",
        };
      }
    }
    return res;
  }, [data]);

  return (
    <Card
      sx={(theme) => ({
        width: 300,
        margin: "10px auto 25px auto",
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
          </Text>{" "}
          @ {resultData[key].name} total
        </Text>
      ))}
    </Card>
  );
};

function getTextColorByCount(count: number) {
  if (count === 0) {
    return "green";
  }
  if (count <= 99) {
    return "yellow";
  }
  if (count <= 499) {
    return "orange";
  }
  return "red";
}

export default PositionTimeLine;
