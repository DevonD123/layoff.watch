import React from "react";
import Card from "@c/Card/Card";
import { Text, Grid, ActionIcon } from "@mantine/core";
import {
  IconLink,
  IconSnowflake,
  IconSnowflakeOff,
  IconAlertTriangle,
  IconCircleCheck,
} from "@tabler/icons";
import Link from "next/link";
import { useFreezeReports } from "./db";
import moment from "moment";
import getCompltedStatusIcon from "@h/getCompletedStatusIcon";

type Props = { company_id: string };

function FreezeCard({ company_id }: Props) {
  const { data, isLoading } = useFreezeReports(company_id);
  return (
    <Card
      isSmall={!data || data.length <= 0}
      title="Hiring freeze history"
      startIcon={<IconSnowflake />}
    >
      {!isLoading && (!data || data.length <= 0) ? (
        <Text color="green" align="center">
          No Freezes reported
        </Text>
      ) : (
        !isLoading &&
        data.map((report: any) => (
          <Grid
            key={report.id}
            sx={(theme) => ({
              borderBottom: `1px solid ${theme.colors.gray[4]}`,
            })}
            mb={5}
          >
            <Grid.Col span={12} pb={0}>
              <Text
                size="lg"
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={report.title}
              >
                {getCompltedStatusIcon(report.is_completed)}
                {report.title}
              </Text>
            </Grid.Col>
            <Grid.Col span={8} pt={0}>
              <Text color="dimmed" align="left">
                {report.is_completed
                  ? "Hiring started @ "
                  : "Hiring stopped @ "}
                {moment(report.layoff_date).format("M/d/yyyy")}
              </Text>
            </Grid.Col>
            <Grid.Col span={4} pt={0}>
              <Link href={`/report/${report.id}`} passHref>
                <ActionIcon
                  component="a"
                  variant="light"
                  color="blue"
                  size="sm"
                  style={{ marginLeft: "auto", marginRight: 0 }}
                >
                  <IconLink />
                </ActionIcon>
              </Link>
            </Grid.Col>
          </Grid>
        ))
      )}
    </Card>
  );
}

export default FreezeCard;
