import React from "react";
import { Box, Text } from "@mantine/core";
import { IconLink } from "@tabler/icons";
import Link from "next/link";

interface IProps {
  data: IPosData[];
}
interface IPosData {
  id: string;
  name: string;
  abbreviation?: string;
}

export default function PositionDisplayLinkList({ data }: IProps) {
  if (data.length <= 0) {
    return <></>;
  }
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {data.map((d) => (
        <Link key={d.id} href={`/position/${d.id}`} passHref>
          <a style={{ textDecoration: "none" }}>
            <Box
              sx={(theme) => ({
                paddingTop: 1,
                paddingBottom: 1,
                paddingRight: theme.spacing.md,
                paddingLeft: theme.spacing.xs,
                background: theme.colors.gray[6],
                borderRadius: theme.radius.sm,
                textAlign: "center",
                marginRight: theme.spacing.sm,
                marginBottom: theme.spacing.sm,
                textDecoration: "none",
              })}
            >
              <Text color="white">
                <Text color="blue" component="span">
                  <IconLink size={14} />
                </Text>{" "}
                {d.abbreviation || d.name}
              </Text>
            </Box>
          </a>
        </Link>
      ))}
    </div>
  );
}
