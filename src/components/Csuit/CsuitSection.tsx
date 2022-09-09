import React from "react";
import { Avatar, Text, Box, Grid } from "@mantine/core";
import Link from "next/link";
import { IconLink } from "@tabler/icons";
import moment from "moment";

interface Props {
  id: string;
  img_url?: string;
  name: string;
  role?: string;
  bio?: string;
  hasLink?: boolean;
  start?: Date;
  end?: Date;
}

function getAvatarUrl(img_url?: string) {
  if (!img_url) {
    return undefined;
  }
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/${process.env.NEXT_PUBLIC_PUB_STORAGE_PATH}/${img_url}`;
}

function CsuitSection({
  id,
  img_url,
  name,
  role,
  start,
  end,
  hasLink = true,
}: Props) {
  return (
    <Grid style={{ width: "100%", marginTop: 5 }}>
      <Grid.Col span={4}>
        {hasLink ? (
          <Link href={`/exec/${id}`} passHref>
            <a>
              <div style={{ position: "relative" }}>
                <Avatar
                  src={getAvatarUrl(img_url)}
                  alt={name}
                  style={{ height: 50, width: 50 }}
                  radius="xl"
                />
                <IconLink style={{ position: "absolute", top: -5, left: -5 }} />
              </div>
            </a>
          </Link>
        ) : (
          <Avatar
            src={img_url}
            alt={name}
            style={{ height: 50, width: 50 }}
            radius="xl"
          />
        )}
      </Grid.Col>
      <Grid.Col span={8}>
        <Text size="lg">
          {name}{" "}
          {role && (
            <Text size="md" color="dimmed" component="span">
              ({role})
            </Text>
          )}
        </Text>
        {start && (
          <Text size="md" color="dimmed">
            {moment(start).format("M/d/yyyy")} to{" "}
            {end ? moment(end).format("M/d/yyyy") : "Current"}
          </Text>
        )}
      </Grid.Col>
    </Grid>
  );
}

export default CsuitSection;
