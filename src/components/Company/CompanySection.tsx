import React, { PropsWithChildren } from "react";
import Link from "next/link";
import {
  Avatar,
  Text,
  Box,
  ThemeIcon,
  Group,
  Badge,
  Skeleton,
} from "@mantine/core";
import { IconChartBar, IconLink, IconSnowflake } from "@tabler/icons";
import Card from "@c/Card/Card";
import { useTopPipAndFreeze } from "./db";
import { ReportType } from "@c/Layoff/types";

interface Props extends PropsWithChildren<{}> {
  id: string;
  name: string;
  logo_url?: string;
  ticker?: string;
  description?: string;
  est_employee_count?: number;
  hasLink?: boolean;
}

export default function CompanySection({
  id,
  name,
  logo_url,
  ticker,
  description,
  est_employee_count,
  hasLink = true,
  children,
}: Props) {
  const { data, isLoading } = useTopPipAndFreeze(id);
  const pipIndex =
    data &&
    data.length >= 1 &&
    data.findIndex((x: any) => x.type === ReportType.Pip && !x.is_complete);
  const freezeIndex =
    data &&
    data.length >= 1 &&
    data.findIndex((x: any) => x.type === ReportType.Freeze && !x.is_complete);
  return (
    <Card>
      {hasLink ? (
        <Link href={`/company/${id}`} passHref>
          <a>
            <div style={{ position: "relative" }}>
              <Avatar
                style={{ height: 150, width: 150 }}
                src={logo_url}
                alt={name}
              />

              <IconLink style={{ position: "absolute", top: -10, left: -10 }} />
            </div>
          </a>
        </Link>
      ) : (
        <Avatar style={{ height: 150, width: 150 }} src={logo_url} alt={name} />
      )}
      <Bubble>
        <Text color="black" size="xl">
          {name}{" "}
          {ticker && (
            <Text color="dimmed" size="md" component="span">
              ({ticker})
            </Text>
          )}
        </Text>
      </Bubble>
      {est_employee_count && (
        <Bubble>
          <Text color="dimmed" size="md">
            Est. Employees {est_employee_count}
          </Text>
        </Bubble>
      )}
      {description && (
        <Bubble>
          <Text color="gray" size="md">
            {description}
          </Text>
        </Bubble>
      )}
      <div>
        <Group position="center" mt={15}>
          {isLoading ? (
            <Skeleton width={75} height={25} radius="lg" />
          ) : (
            <Badge
              size="lg"
              radius="xl"
              // color="orange"
              color={pipIndex ? "orange" : "green"}
              pl={0}
              leftSection={<IconChartBar size={15} />}
              styles={{
                leftSection: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                },
              }}
            >
              <span
                style={{
                  textTransform: "none",
                }}
              >
                {pipIndex ? `PIP ${data[pipIndex].percent}% target` : `No PIP`}
              </span>
            </Badge>
          )}
          {isLoading ? (
            <Skeleton width={75} height={25} radius="lg" />
          ) : (
            <Badge
              size="lg"
              radius="xl"
              color={freezeIndex ? "orange" : "green"}
              pl={0}
              styles={{
                leftSection: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                },
              }}
              leftSection={<IconSnowflake size={15} />}
            >
              <span
                style={{
                  textTransform: "none",
                }}
              >
                {freezeIndex ? `Hiring Freeze` : `Hiring`}
              </span>
            </Badge>
          )}
        </Group>
      </div>

      {children && <div style={{ marginTop: 20 }}>{children}</div>}
    </Card>
  );
}

export const Bubble = ({ children }: PropsWithChildren<{}>) => (
  <BubbleInner px={"lg"} py={0}>
    {children}
  </BubbleInner>
);

const BubbleInner = ({
  children,
  px,
  py,
}: PropsWithChildren<{
  px: "lg" | "xs" | "md" | "sm" | "lg" | 0;
  py: "lg" | "xs" | "md" | "sm" | "lg" | 0;
}>) => (
  <Box
    sx={(theme) => ({
      marginTop: theme.spacing.sm,
      backgroundColor: theme.colors.gray[0],
      paddingTop: typeof py === "number" ? py : theme.spacing[py],
      paddingBottom: typeof py === "number" ? py : theme.spacing[py],
      paddingRight: typeof px === "number" ? px : theme.spacing[px],
      paddingLeft: typeof px === "number" ? px : theme.spacing[px],
      borderRadius: theme.radius.lg,
    })}
  >
    {children}
  </Box>
);
