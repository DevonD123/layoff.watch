import { useState, PropsWithChildren } from "react";
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Text,
  MediaQuery,
  useMantineTheme,
  Group,
  ActionIcon,
  Button,
  Drawer,
} from "@mantine/core";
import {
  IconBrandApple,
  IconIdBadge,
  IconChartInfographic,
  IconUserCircle,
  IconLockAccess,
} from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import ClientLayoffForm from "@c/Layoff/ClientLayoffForm";
import { useUser } from "@supabase/auth-helpers-react";
import { User } from "@supabase/supabase-js";

interface IProps extends PropsWithChildren<{}> {}

const mobileBreakPoint = "sm";
const Pages = ({ currentPath, user }: { currentPath: string; user?: User }) => {
  return (
    <Group position="apart">
      <Link href="/" passHref>
        <ActionIcon
          variant="transparent"
          component="a"
          disabled={currentPath === "/company"}
        >
          <IconBrandApple
            color={currentPath === "/company" ? "blue" : undefined}
          />
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
      <Link href={user ? "/account" : "/auth"} passHref>
        <ActionIcon variant="transparent" component="a">
          {user ? (
            <IconUserCircle
              color={currentPath === "/account" ? "blue" : undefined}
            />
          ) : (
            <IconLockAccess
              color={currentPath.includes("/auth") ? "blue" : undefined}
            />
          )}
        </ActionIcon>
      </Link>
    </Group>
  );
};
const MainLayout = ({ children }: IProps) => {
  const router = useRouter();
  const theme = useMantineTheme();
  const { user, error } = useUser();
  const [openReportLayoff, setopenReportLayoff] = useState(false);
  const [opened, setOpened] = useState(false);

  const closeReportLayoff = () => setopenReportLayoff(false);
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
          <Link href="/" passHref>
            <Text weight={700} component="a">
              Layoff Watch
            </Text>
          </Link>
          <Pages currentPath={router.pathname} user={user} />
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
            <Pages currentPath={router.pathname} user={user} />
          </Footer>
        </MediaQuery>
      }
      header={
        <Header height={70} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <Link href="/" passHref>
              <Text weight={700} component="a">
                Layoff Watch
              </Text>
            </Link>
            <Button
              color="pink"
              ml="auto"
              mr="0"
              onClick={() => setopenReportLayoff(true)}
            >
              Report a Layoff
            </Button>
          </div>
        </Header>
      }
    >
      {children}
      <Drawer
        position="bottom"
        opened={openReportLayoff}
        onClose={closeReportLayoff}
        title={"Report a layoff"}
        padding="md"
        size="xl"
      >
        <ClientLayoffForm
          user={user}
          open={openReportLayoff}
          onClose={closeReportLayoff}
        />
      </Drawer>
    </AppShell>
  );
};

export default MainLayout;
