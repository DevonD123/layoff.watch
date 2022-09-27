import React, { useState } from "react";
import ListCard from "@c/Card/ListCard";
import {
  Avatar,
  Text,
  ActionIcon,
  Card,
  Drawer,
  Button,
  Title,
} from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons";
import { useCompanyRecentLayoffs } from "./db";
import getImage from "@h/getImage";

type Props = {};

export default function RecentLayoffsCard({}: Props) {
  const [selected, setSelected] = useState<any | null>(null);
  const { data, isLoading } = useCompanyRecentLayoffs();
  return (
    <ListCard title="Recent Layoffs" linkUrl="/company" isLoading={isLoading}>
      {data &&
        data.map((c: any) => (
          <Card
            key={c.id}
            py="xs"
            px="xs"
            withBorder
            style={{ marginTop: 5, zIndex: 5 }}
          >
            <Card.Section
              py="xs"
              px="xs"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    borderRadius: "50%",
                    height: 30,
                    width: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "red",
                    marginRight: 5,
                  }}
                >
                  <Avatar
                    style={{ border: "1px solid black" }}
                    radius="xl"
                    size="sm"
                    src={getImage({
                      url: c.uploaded_logo_key,
                      fallbackUrl: c?.logo_url,
                      size: 25,
                    })}
                  >
                    {c.name.charAt(0)}
                  </Avatar>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Text align="start" title={c.name}>
                    {c.name}
                  </Text>
                  {c.ticker && (
                    <Text size="xs" align="start" color="dimmed">
                      {c.ticker}
                    </Text>
                  )}
                </div>
              </div>

              <div style={{ display: "flex" }}>
                <div>
                  <Text
                    color="red"
                    align="right"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    23,500
                    <Text
                      component="span"
                      color="dimmed"
                      style={{ fontWeight: 200 }}
                    >
                      {" "}
                      |{" "}
                    </Text>
                    <Text
                      component="span"
                      color="dimmed"
                      size="xs"
                      style={{ fontWeight: 200 }}
                    >
                      5%
                    </Text>
                  </Text>
                  <Text
                    align="right"
                    size="xs"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    On 8/23/2022
                  </Text>
                </div>
                <ActionIcon onClick={() => setSelected(c)}>
                  <IconDotsVertical />
                </ActionIcon>
              </div>
            </Card.Section>
          </Card>
        ))}
      <Drawer
        position="bottom"
        opened={selected !== null}
        onClose={() => setSelected(null)}
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Avatar
              mr="sm"
              radius="xl"
              size="lg"
              src={
                selected &&
                getImage({
                  url: selected.uploaded_logo_key,
                  fallbackUrl: selected?.logo_url,
                  size: 50,
                })
              }
            >
              {selected?.name?.charAt(0)}
            </Avatar>{" "}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Title order={3}>{selected?.name}</Title>
              {selected?.ticker && (
                <Text color="dimmed" size="md">
                  {selected?.ticker}
                </Text>
              )}
            </div>
          </div>
        }
        padding="xl"
        size="xl"
      >
        <Button>Report</Button>
      </Drawer>
    </ListCard>
  );
}
