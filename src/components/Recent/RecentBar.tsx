import React, { useMemo, useRef } from "react";
import { Carousel } from "@mantine/carousel";
import { Avatar, Badge, Text, createStyles, Skeleton } from "@mantine/core";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { useRecentCompany } from "./db";
import moment from "moment";

type Props = {};

const useStyles = createStyles((_theme, _params, getRef) => ({
  controls: {
    ref: getRef("controls"),
    transition: "opacity 150ms ease",
    opacity: 0,
  },

  root: {
    "&:hover": {
      [`& .${getRef("controls")}`]: {
        opacity: 1,
      },
    },
  },

  badgeRoot: {
    justifyContent: "space-between",
    height: "100%",
    width: "95%",
    textTransform: "none",
  },
  rightSection: {
    paddingRight: 5,
  },
  leftSection: {
    paddingLeft: 5,
  },
}));

interface IData {
  layoff_id: string;
  company_id: string;
  name: string;
  amount: number;
  logo_url?: string;
  layoff_date?: string;
}
const RecentBar = ({}: Props) => {
  const { classes } = useStyles();
  const { isLoading, data } = useRecentCompany();
  const autoplay = useRef(Autoplay({ delay: 5000 }));

  if (!data || data.length <= 0) {
    return <Skeleton width="100%" height="50px" />;
  }
  return (
    <Carousel
      classNames={{
        controls: classes.controls,
        root: classes.root,
      }}
      slideSize="65%"
      height={50}
      align="start"
      controlSize={14}
      loop
      plugins={[autoplay.current]}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={autoplay.current.reset}
    >
      {data &&
        data.length >= 1 &&
        data.map((x: IData) => {
          const dayDif = moment()
            .startOf("day")
            .diff(moment(x.layoff_date).startOf("day"), "day");
          return (
            <Carousel.Slide
              key={x.layoff_id}
              style={{ display: "flex", alignItems: "center" }}
            >
              <Badge
                variant={"outline"}
                color={"orange"}
                radius="xs"
                classNames={{
                  root: classes.badgeRoot,
                  leftSection: classes.leftSection,
                  rightSection: classes.rightSection,
                }}
                leftSection={
                  <Avatar
                    src={x.logo_url && `${x.logo_url}?size=30&format=png`}
                    alt={x.name}
                  ></Avatar>
                }
                rightSection={
                  <Text
                    align="right"
                    size="md"
                    color={
                      x.amount >= 1000
                        ? "red"
                        : x.amount >= 100
                        ? "orange"
                        : "yellow"
                    }
                  >
                    {x.amount}
                  </Text>
                }
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Link href={`/layoff/${x.layoff_id}`} passHref>
                    <Text size="sm" color="black" component="a">
                      {x.name}
                    </Text>
                  </Link>
                  <Text size="xs" color={"dimmed"}>
                    {x.layoff_date && dayDif <= 1 && dayDif >= -1
                      ? "TODAY"
                      : moment(x.layoff_date).startOf("day").fromNow()}
                  </Text>
                </div>
              </Badge>
            </Carousel.Slide>
          );
        })}
    </Carousel>
  );
};

export default RecentBar;
