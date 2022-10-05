import { useState, PropsWithChildren } from 'react';
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
  Skeleton,
  NavLink,
  Switch,
} from '@mantine/core';
import {
  IconBrandApple,
  IconIdBadge,
  IconUserCircle,
  IconLockAccess,
  IconHome,
  IconArrowNarrowLeft,
  IconBriefcase,
} from '@tabler/icons';
import useMediaQueries from '@h/hooks/useMediaQueries';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ClientLayoffForm from '@c/Layoff/ClientLayoffForm';
import RecentBar from '@c/Recent';
import QSP from '@h/qsp';
import dynamic from 'next/dynamic';
import {
  InternalUserProvider,
  useInternalUser,
  IInternalUser,
} from '@h/context/userContext';
import AdminEdit from './AdminEdit';

interface IProps extends PropsWithChildren<{}> {}

const Chart = dynamic(() => import('@c/Chart/LayoffLineChart'), {
  ssr: false,
  loading: () => <Skeleton height="100%" width="100%" animate />,
}) as any;

const mobileBreakPoint = 'sm';
const Links = ({
  currentPath,
  user,
  isLargerThanTable,
}: {
  currentPath: string;
  user?: IInternalUser;
  isLargerThanTable: boolean;
}) => {
  if (isLargerThanTable) {
    return (
      <>
        <Link href="/" passHref>
          <NavLink
            label="Home"
            icon={<IconHome size={16} />}
            description="my feed"
            active={currentPath === '/'}
          />
        </Link>
        <Link href="/company" passHref>
          <NavLink
            label="Company"
            description="all companies"
            icon={<IconBrandApple size={16} />}
            active={currentPath === '/company'}
          />
        </Link>
        <Link href="/exec" passHref>
          <NavLink
            label="Executives"
            description="all executives"
            icon={<IconIdBadge size={16} />}
            active={currentPath === '/exec'}
          />
        </Link>
        <Link href="/position" passHref>
          <NavLink
            label="Positions"
            icon={<IconBriefcase size={16} />}
            active={currentPath === '/position'}
          />
        </Link>
        {user ? (
          <Link href="/account" passHref>
            <NavLink
              label="My Account"
              icon={<IconUserCircle size={16} />}
              active={currentPath === '/account'}
            />
          </Link>
        ) : (
          <>
            <Link href={`/auth?${[QSP.page]}=login`} passHref>
              <Button
                color="green"
                leftIcon={<IconLockAccess size={16} />}
                mb="sm"
                mt="sm"
              >
                Login
              </Button>
            </Link>
            <Link href={`/auth?${[QSP.page]}=sign-up`} passHref>
              <Button
                color="blue"
                leftIcon={<IconLockAccess size={16} />}
                mb="sm"
              >
                Sign up
              </Button>
            </Link>
          </>
        )}
      </>
    );
  }

  return (
    <Group position="apart">
      <Link href="/" passHref>
        <ActionIcon
          variant="transparent"
          component="a"
          disabled={currentPath === '/'}
        >
          <IconHome color={currentPath === '/' ? 'blue' : undefined} />
        </ActionIcon>
      </Link>
      <Link href="/company" passHref>
        <ActionIcon
          variant="transparent"
          component="a"
          disabled={currentPath === '/company'}
        >
          <IconBrandApple
            color={currentPath === '/company' ? 'blue' : undefined}
          />
        </ActionIcon>
      </Link>
      <Link href="/exec" passHref>
        <ActionIcon
          variant="transparent"
          component="a"
          disabled={currentPath === '/exec'}
        >
          <IconIdBadge color={currentPath === '/exec' ? 'blue' : undefined} />
        </ActionIcon>
      </Link>
      <Link href={user ? '/account' : '/auth'} passHref>
        <ActionIcon variant="transparent" component="a">
          {user ? (
            <IconUserCircle
              color={currentPath === '/account' ? 'blue' : undefined}
            />
          ) : (
            <IconLockAccess
              color={currentPath.includes('/auth') ? 'blue' : undefined}
            />
          )}
        </ActionIcon>
      </Link>
    </Group>
  );
};
const MainLayout = ({ children }: IProps) => {
  const media = useMediaQueries();
  const router = useRouter();
  const theme = useMantineTheme();
  const { user, isLoading, isEditMode, setEdit } = useInternalUser();
  const [openReportLayoff, setopenReportLayoff] = useState(false);
  const [opened, setOpened] = useState(false);

  const closeReportLayoff = () => setopenReportLayoff(false);
  return (
    <AppShell
      styles={{
        main: {
          background: theme.colors.lightBg[0],
        },
      }}
      navbarOffsetBreakpoint={mobileBreakPoint}
      navbar={
        <Navbar
          p="xs"
          hiddenBreakpoint={mobileBreakPoint}
          hidden={!opened}
          width={{ sm: 200, lg: 350 }}
          height={`calc(100vh - 110px)`}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              overflowY: 'auto',
              padding: 5,
              direction: 'rtl',
              scrollbarWidth: 'thin',
            }}
          >
            <div style={{ width: '100%', direction: 'ltr' }}>
              <Links
                currentPath={router.pathname}
                user={user}
                isLargerThanTable={media.isLargerThanTablet}
              />

              <div style={{ width: '100%', height: 300 }}>
                <Chart showYTicks={media.isLargeDesktop} />
              </div>
              {media.isLargeDesktop && user?.isAdmin && (
                <>
                  {router.pathname.includes('/exec') && router.query.id && (
                    <div style={{ margin: '10px auto', width: 150 }}>
                      <Switch
                        label="Edit mode"
                        checked={isEditMode}
                        onChange={(e) => setEdit(e.target.checked)}
                      />
                    </div>
                  )}
                  <AdminEdit router={router} />
                </>
              )}
            </div>
          </div>
        </Navbar>
      }
      footer={
        <MediaQuery largerThan={mobileBreakPoint} styles={{ display: 'none' }}>
          <Footer height={60} p="md">
            <Links
              currentPath={router.pathname}
              user={user}
              isLargerThanTable={false}
            />
          </Footer>
        </MediaQuery>
      }
      header={
        <Header height={110} p="md">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              marginBottom: 5,
            }}
          >
            <BackButton isLargerThanTablet={media.isLargerThanTablet} />
            <Link href="/" passHref>
              <Text weight={700} component="a">
                Layoff Watch
              </Text>
            </Link>
            {user && (
              <Button
                color="pink"
                ml="auto"
                mr="0"
                onClick={() => setopenReportLayoff(true)}
              >
                Report info
              </Button>
            )}
            {!user && (
              <Link href={`/auth?${QSP.page}=sign-up`}>
                <Button color="blue" ml="auto" mr="0">
                  Login/Sign up
                </Button>
              </Link>
            )}
          </div>
          <RecentBar />
        </Header>
      }
    >
      {children}
      <Drawer
        position={media.isLargerThanTablet ? 'right' : 'bottom'}
        opened={openReportLayoff}
        onClose={closeReportLayoff}
        title={'Report a:'}
        padding="md"
        size="xl"
      >
        {!user && (
          <>
            <Link href={`/auth?${QSP.page}=sign-up`}>
              <Button color="blue" mx="auto" size="xl">
                Please create a free account before posting
              </Button>
            </Link>
            <br />
            <Link href={`/auth?${QSP.page}=login`}>
              <Button color="green" mx="auto" size="xl">
                Have an account? Login
              </Button>
            </Link>
          </>
        )}
        {user && (
          <ClientLayoffForm
            userEmail={user.email}
            open={openReportLayoff}
            onClose={closeReportLayoff}
          />
        )}
      </Drawer>
    </AppShell>
  );
};

const BackButton = ({
  isLargerThanTablet,
}: {
  isLargerThanTablet: boolean;
}) => {
  const router = useRouter();

  if (
    isLargerThanTablet ||
    ['/company', '/', '/exec', '/account'].includes(router.pathname)
  ) {
    return null;
  }

  return (
    <IconArrowNarrowLeft
      style={{ marginRight: 5 }}
      size={15}
      onClick={() => router.back()}
    />
  );
};

const MainLayoutWrapper = ({ children }: PropsWithChildren<{}>) => (
  <InternalUserProvider>
    <MainLayout>{children}</MainLayout>
  </InternalUserProvider>
);

export default MainLayoutWrapper;
