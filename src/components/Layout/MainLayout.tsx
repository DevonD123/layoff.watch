import { useState, PropsWithChildren } from "react";
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  //   Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Group,
  ActionIcon,
} from "@mantine/core";
import {
  IconBrandApple,
  IconIdBadge,
  IconReportMedical,
  IconChartInfographic,
} from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";
interface IProps extends PropsWithChildren<{}> {}

const mobileBreakPoint = "sm";
const Pages = ({ currentPath }: { currentPath: string }) => {
  return (
    <Group position="apart">
      <Link href="/" passHref>
        <ActionIcon
          variant="transparent"
          component="a"
          disabled={currentPath === "/"}
        >
          <IconBrandApple color={currentPath === "/" ? "blue" : undefined} />
        </ActionIcon>
      </Link>
      <Link href="/exec" passHref>
        <ActionIcon
          variant="transparent"
          component="a"
          disabled={currentPath === "/exec"}
        >
          <IconIdBadge color={currentPath === "/exec" ? "blue" : undefined} />
        </ActionIcon>
      </Link>
      <Link href="/stats" passHref>
        <ActionIcon
          variant="transparent"
          component="a"
          disabled={currentPath === "/stats"}
        >
          <IconChartInfographic
            color={currentPath === "/stats" ? "blue" : undefined}
          />
        </ActionIcon>
      </Link>
      <ActionIcon
        variant="transparent"
        component="a"
        onClick={() => alert("Report")}
      >
        <IconReportMedical />
      </ActionIcon>
    </Group>
  );
};
const MainLayout = ({ children }: IProps) => {
  const router = useRouter();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint={mobileBreakPoint}
      //   asideOffsetBreakpoint={mobileBreakPoint}
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint={mobileBreakPoint}
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          <Text>Application navbar</Text>
          <Pages currentPath={router.pathname} />
        </Navbar>
      }
      //   aside={
      //     <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
      //       <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
      //         <Text>Application sidebar</Text>
      //       </Aside>
      //     </MediaQuery>
      //   }
      footer={
        <MediaQuery largerThan={mobileBreakPoint} styles={{ display: "none" }}>
          <Footer height={60} p="md">
            <Pages currentPath={router.pathname} />
          </Footer>
        </MediaQuery>
      }
      header={
        <Header height={70} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <Text>Application header</Text>
            <MediaQuery
              largerThan={mobileBreakPoint}
              styles={{ display: "none" }}
            >
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                style={{ marginRight: 0, marginLeft: "auto" }}
              />
            </MediaQuery>
          </div>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
};

export default MainLayout;
