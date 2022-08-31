import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useMantineTheme } from "@mantine/core";
import { useLayoffMSummary } from "./db";

interface IDataMap {
  [key: number]: IData;
}
interface IData {
  name: string;
  layoffs: number;
  lastYear: number;
}
const LayoffLineChart = () => {
  const theme = useMantineTheme();
  const { isLoading, error, data } = useLayoffMSummary();
  if (error) {
    console.error(error);
  }
  const dataTransformed = useMemo(() => {
    const dataObj: IDataMap = {
      1: { name: "Jan", layoffs: 0, lastYear: 0 },
      2: { name: "Feb", layoffs: 0, lastYear: 0 },
      3: { name: "Mar", layoffs: 0, lastYear: 0 },
      4: { name: "Apr", layoffs: 0, lastYear: 0 },
      5: { name: "May", layoffs: 0, lastYear: 0 },
      6: { name: "Jun", layoffs: 0, lastYear: 0 },
      7: { name: "Jul", layoffs: 0, lastYear: 0 },
      8: { name: "Aug", layoffs: 0, lastYear: 0 },
      9: { name: "Sep", layoffs: 0, lastYear: 0 },
      10: { name: "Oct", layoffs: 0, lastYear: 0 },
      11: { name: "Nov", layoffs: 0, lastYear: 0 },
      12: { name: "Dec", layoffs: 0, lastYear: 0 },
    };

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    if (data) {
      for (let i = 0; i < data.length; i++) {
        dataObj[data[i].mth as keyof IDataMap][
          data[i].yr === currentYear ? "layoffs" : "lastYear"
        ] = data[i].layoffs;
      }
    }

    return Object.keys(dataObj)
      .map((key) => {
        const dataKey: keyof IDataMap = parseInt(key);
        return {
          name: dataObj[dataKey].name,
          layoffs: dataObj[dataKey].layoffs,
          lastYear: dataObj[dataKey].lastYear,
          date: new Date(
            dataKey > currentMonth ? currentYear - 1 : currentYear,
            dataKey,
            1,
            0,
            0,
            0,
            0
          ).getTime(),
        };
      })
      .sort((a, b) => a.date - b.date);
  }, [data]);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={dataTransformed}
        margin={{
          top: 5,
          right: 10,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="layoffs"
          stroke={theme.colors[theme.primaryColor][5]} //"#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="lastYear"
          stroke={theme.colors.red[4]} //"#8884d8"
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LayoffLineChart;
