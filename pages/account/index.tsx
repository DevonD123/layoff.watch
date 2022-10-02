import React from "react";
import MainLayout from "@c/Layout";
import useRequiredUser from "@h/useRequiredUser";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { Anchor, Text } from "@mantine/core";
import { IconLogout } from "@tabler/icons";
import Link from "next/link";

type Props = {};

const Account = ({}: Props) => {
  const { user, isLoading } = useRequiredUser();
  async function logout() {
    await supabaseClient.auth.signOut();
  }
  return (
    <MainLayout>
      {isLoading && "Loading...."}
      {user?.email}{" "}
      {user?.user_metadata?.isAdmin && (
        <Text color="red" ml={5} component="span">
          (Admin)
        </Text>
      )}
      <br />
      <br />
      {!isLoading && (
        <Link href="/account/changepass" passHref>
          <Anchor>Change Password</Anchor>
        </Link>
      )}
      <br />
      <br />
      {!isLoading && (
        <Anchor onClick={logout}>
          <IconLogout size={18} /> Logout
        </Anchor>
      )}
    </MainLayout>
  );
};

export default Account;
