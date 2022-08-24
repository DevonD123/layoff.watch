import React from "react";
import Link from "next/link";
import { Button, Box, Group } from "@mantine/core";
import { useRouter } from "next/router";

type Props = {};

function AdminNavbar({}: Props) {
  const router = useRouter();
  return (
    <>
      <Box
        sx={{
          zIndex: 900,
          position: "fixed",
          top: 0,
          right: 0,
          left: 0,
          height: 50,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 2,
          paddingBottom: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <NavLink
            title="Admin"
            currentPathName={router.pathname}
            href="/admin"
            skipSubIndicator
          />
        </div>
        <Group>
          <NavLink
            title="Reported"
            currentPathName={router.pathname}
            href="/admin/report"
            color="orange"
            disabled
          />

          <NavLink
            title="Posts"
            currentPathName={router.pathname}
            href="/admin/post"
            disabled
          />
          <NavLink
            title="Create Posts"
            currentPathName={router.pathname}
            href="/admin/post/new"
          />
          <NavLink
            title="Users"
            currentPathName={router.pathname}
            href="/admin/user"
            disabled
          />
          <NavLink
            title="Companies"
            currentPathName={router.pathname}
            href="/admin/company"
          />
          <NavLink
            title="Orgs"
            currentPathName={router.pathname}
            href="/admin/org"
          />
          <NavLink
            title="Execs"
            currentPathName={router.pathname}
            href="/admin/exec"
          />
        </Group>
      </Box>
      <div style={{ height: 50, width: "100%" }} />
    </>
  );
}

const NavLink = ({
  href,
  title,
  currentPathName,
  color,
  skipSubIndicator,
  disabled,
}: {
  href: string;
  title: string;
  currentPathName: string;
  color?: string;
  skipSubIndicator?: boolean;
  disabled?: boolean;
}) => {
  return (
    <Link href={href} passHref>
      <Button
        size="xs"
        color={color}
        variant={
          currentPathName !== href && currentPathName.includes(href)
            ? !skipSubIndicator
              ? "outline"
              : "subtle"
            : "subtle"
        }
        component="a"
        disabled={currentPathName === href || disabled}
      >
        {title}
      </Button>
    </Link>
  );
};

export default AdminNavbar;
