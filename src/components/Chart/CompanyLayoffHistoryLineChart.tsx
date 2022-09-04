import React, { useMemo } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from "recharts";
import { useMantineTheme, Text } from "@mantine/core";
import { useCompanyLayoffHistory } from "./db";
import Card from "@c/Card/Card";
import dynamic from "next/dynamic";

const Recharts = dynamic(() => import("recharts"), {
  ssr: false,
}) as any;

interface IData {
  yr: number;
  layoffs: number;
}
const LayoffLineChart = ({ id }: { id: string }) => {
  const theme = useMantineTheme();
  const { isLoading, error, data } = useCompanyLayoffHistory(id);
  if (error) {
    console.error(error);
  }
  const dataTransformed: IData[] = useMemo(() => {
    if (!data || data.length <= 0) {
      return [];
    }

    const currentYear = new Date().getFullYear();
    if (data.length === 1 && data[0].yr === currentYear) {
      return [
        {
          yr: currentYear - 1,
          layoffs: 0,
        },
        {
          yr: data[0].yr,
          layoffs: data[0].layoffs,
        },
      ];
    }

    const arr: IData[] = [
      {
        yr: data[0].yr - 1,
        layoffs: 0,
      },
    ];
    const years = currentYear - data[0].yr;
    const minYear = data[0].yr;

    for (let i = 0; i <= years; i++) {
      const y = minYear + i;
      const dataIndex = data.findIndex((x: any) => x.yr === y);
      if (dataIndex === -1) {
        arr.push({
          layoffs: 0,
          yr: y,
        });
      } else {
        arr.push(data[dataIndex]);
      }
    }

    return arr;
  }, [data]);
  if (!dataTransformed || dataTransformed.length <= 0) {
    return (
      <Card isDark title="Layoff history">
        <Text size="md" align="center" color="green">
          No reported layoffs
        </Text>
      </Card>
    );
  }
  return (
    <Card isDark title="Layoff history">
      <Recharts.LineChart
        width={300}
        height={400}
        data={dataTransformed}
        margin={{
          top: 5,
          right: 10,
          left: 0,
          bottom: 5,
        }}
      >
        <Recharts.CartesianGrid strokeDasharray="3 3" />
        <Recharts.XAxis dataKey="yr" />
        <Recharts.YAxis />
        <Recharts.Tooltip />
        <Recharts.Legend />
        <Recharts.Line
          type="monotone"
          dataKey="layoffs"
          stroke={theme.colors[theme.primaryColor][5]}
          activeDot={{ r: 8 }}
        />
      </Recharts.LineChart>
    </Card>
  );
};

export default LayoffLineChart;
