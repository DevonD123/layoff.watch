import React, { useState } from "react";
import MainLayout from "@c/Layout";
import useRequiredUser from "@h/useRequiredUser";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { Button, Text, Input, PasswordInput } from "@mantine/core";
import { useRouter } from "next/router";
import { IconLock, IconArrowBack } from "@tabler/icons";
import showMsg from "@h/msg";

type Props = {};

const ChangePass = ({}: Props) => {
  const [loading, seLoading] = useState(false);
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const { user, isLoading } = useRequiredUser();
  const router = useRouter();
  async function changePass() {
    let didError = false;
    try {
      seLoading(true);
      await supabaseClient.auth.update({ password: pass });
      showMsg("Password changed", "success");
    } catch (e) {
      console.error(e);
      didError = true;
      showMsg("Error changing password", "error");
    } finally {
      seLoading(false);
      setPass("");
      setPass2("");
      if (!didError) {
        router.replace("/account");
      }
    }
  }
  return (
    <MainLayout>
      {isLoading && "Loading...."}
      <div
        style={{
          width: 300,
          margin: "5vh auto auto auto",
        }}
      >
        <Text size="xl" align="center" sx={{ marginBottom: 50 }}>
          Change your password
        </Text>
        <PasswordInput
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          label="Your password"
          placeholder="Your password"
          icon={<IconLock size={16} />}
          sx={{ marginBottom: 10 }}
        />
        <PasswordInput
          value={pass2}
          onChange={(e) => setPass2(e.target.value)}
          label="Confirm"
          placeholder="Again please & thank you"
          icon={<IconLock size={16} />}
          sx={{ marginBottom: 25 }}
        />
        <Button
          fullWidth
          variant="filled"
          onClick={changePass}
          disabled={pass !== pass2 || !pass}
          sx={{
            marginTop: 10,
            marginBottom: 25,
          }}
          loading={isLoading || loading}
        >
          Change
        </Button>
        <Button
          fullWidth
          variant="subtle"
          leftIcon={<IconArrowBack />}
          onClick={() => {
            seLoading(false);
            setPass("");
            setPass2("");
            router.back();
          }}
        >
          Cancel
        </Button>
      </div>
    </MainLayout>
  );
};

export default ChangePass;
