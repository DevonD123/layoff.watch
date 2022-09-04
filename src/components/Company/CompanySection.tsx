import React, { PropsWithChildren } from "react";
import Link from "next/link";
import { Avatar, Text, Box } from "@mantine/core";
import { IconLink } from "@tabler/icons";
import Card from "@c/Card/Card";

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
