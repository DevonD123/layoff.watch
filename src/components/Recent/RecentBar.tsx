import React, { useEffect, useRef, useState } from "react";
import { Carousel } from "@mantine/carousel";
import {
  Avatar,
  Badge,
  Text,
  createStyles,
  Skeleton,
  Collapse,
  Button,
} from "@mantine/core";
import { IconLink } from "@tabler/icons";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { useRecentCompany, fetchLayoffById } from "./db";
import moment from "moment";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";

type Props = {};

const useStyles = createStyles((theme, _params, getRef) => ({
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
  collapse: {
    width: "100%",
    display: "flex",
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    alignItems: "center",
    height: 51,
    background: theme.colors.lightBg[0],
    border: `1px solid ${theme.colors.red[9]}`,
  },
  collapseParent: {
    position: "absolute",
    top: -1,
    left: -1,
    right: -1,
    zIndex: 998,
  },
  recentBar: {
    position: "relative",
    width: "100%",
  },
  container: {
    width: "42.5%",
    display: "flex",
    flexDirection: "column",
    padding: 2,
  },
  smallContainer: {
    width: "15%",
    display: "flex",
    flexDirection: "column",
    padding: 2,
    alignItems: "center",
  },
  textOverflow: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
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
interface INewLayoff extends IData {
  company_name: string;
  percent?: number;
}
const RecentBar = ({}: Props) => {
  const [newLayoff, setNewLayoff] = useState<INewLayoff | null>(null);
  const { classes } = useStyles();
  const router = useRouter();
  const { isLoading, data } = useRecentCompany();
  const autoplay = useRef(Autoplay({ delay: 5000 }));

  useEffect(() => {
    let timout: any;
    const sub = supabaseClient
      .from("layoff")
      .on("INSERT", async (payload: any) => {
        const { data, error } = await fetchLayoffById(payload.new.id);
        if (!error) {
          setNewLayoff({
            layoff_id: data.id,
            company_id: data.ccompany_id,
            layoff_date: data.layoff_date,
            amount: data.number,
            percent: data.percent,
            company_name: data.company.name,
            logo_url: data.company.logo_url,
            name: data.title,
          });
          timout = setTimeout(() => {
            setNewLayoff(null);
          }, 5000);
        }
      })
      .subscribe((x: string) => {
        console.log(x);
      });

    function unSub() {
      clearTimeout(timout ? (timout as number) : undefined);
      supabaseClient.removeSubscription(sub);
    }

    return () => unSub();
  }, []);

  if (isLoading || !data || data.length <= 0) {
    return <Skeleton width="100%" height="50px" />;
  }
  return (
    <div className={classes.recentBar}>
      <div className={classes.collapseParent}>
        <Collapse
          in={
            newLayoff !== null && !router.pathname.includes(newLayoff.layoff_id)
          }
        >
          {newLayoff &&
            (!router.pathname.includes(newLayoff.company_id) ? (
              <div className={classes.collapse}>
                <div className={classes.smallContainer}>
                  {newLayoff.logo_url && (
                    <Avatar
                      size="sm"
                      src={`${newLayoff.logo_url}?size=20&format=png`}
                      alt={newLayoff.name}
                    ></Avatar>
                  )}
                  <Badge
                    radius="xs"
                    size={newLayoff.logo_url ? "xs" : "md"}
                    color="red"
                    variant="filled"
                  >
                    NEW!
                  </Badge>
                </div>
                <div className={classes.container}>
                  <Text
                    align="center"
                    size="md"
                    className={classes.textOverflow}
                    color={
                      newLayoff.amount >= 1000
                        ? "red"
                        : newLayoff.amount >= 100
                        ? "orange"
                        : "yellow"
                    }
                  >
                    {newLayoff.amount && "#"}
                    {newLayoff.amount}{" "}
                    {newLayoff.amount && newLayoff.percent && (
                      <Text size="xs" color="dimmed" component="span">
                        |
                      </Text>
                    )}{" "}
                    {newLayoff.percent}
                    {newLayoff.percent && "%"}
                  </Text>
                  <Text
                    size="xs"
                    color={"dimmed"}
                    align="center"
                    className={classes.textOverflow}
                  >
                    {newLayoff.company_name}
                  </Text>
                </div>
                <div className={classes.container}>
                  <Link href={`/layoff/${newLayoff.layoff_id}`} passHref>
                    <Text
                      size="sm"
                      color="black"
                      component="a"
                      align="right"
                      className={classes.textOverflow}
                    >
                      <Text component="span" color="blue" underline>
                        <IconLink size={12} />
                      </Text>
                      {newLayoff.name}
                    </Text>
                  </Link>
                  <Text
                    size="xs"
                    color={"dimmed"}
                    align="right"
                    className={classes.textOverflow}
                  >
                    {moment(newLayoff.layoff_date).startOf("day").fromNow()}
                  </Text>
                </div>
              </div>
            ) : (
              <div className={classes.collapse}>
                <Button
                  onClick={() => router.replace(window.location.pathname)}
                >
                  Refresh to see just added info!
                </Button>
              </div>
            ))}
        </Collapse>
      </div>
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
                      className={classes.textOverflow}
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
                      <Text
                        size="sm"
                        color="black"
                        component="a"
                        className={classes.textOverflow}
                      >
                        <Text component="span" color="blue" underline>
                          <IconLink size={12} />
                        </Text>
                        {x.name}
                      </Text>
                    </Link>
                    <Text
                      size="xs"
                      color={"dimmed"}
                      className={classes.textOverflow}
                    >
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
    </div>
  );
};

export default RecentBar;
