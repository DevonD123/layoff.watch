import React, { useState, useEffect } from "react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";
import {
  Card,
  TextInput,
  Checkbox,
  Container,
  Button,
  Text,
  Anchor,
  LoadingOverlay,
  PasswordInput,
} from "@mantine/core";
import { IconBrandGoogle, IconBrandFacebook } from "@tabler/icons";
import Link from "next/link";
import QSP from "@h/qsp";
import { Provider } from "@supabase/supabase-js";
import showMsg from "@h/msg";
const DEFAULT_DATA = {
  email: "",
  password: "",
  password2: "",
  check1: false,
  check2: true,
};
const AuthPg = () => {
  const router = useRouter();
  const { user, error } = useUser();
  const [pg, setPg] = useState("sign-in");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(DEFAULT_DATA);

  useEffect(() => {
    if (!!user) {
      router.replace("/account");
    } else {
      setPg((router.query[QSP.page] || "sign-up") as string);
    }
  }, [user, router]);

  useEffect(() => {
    setData({
      email: "",
      password: "",
      password2: "",
      check1: false,
      check2: true,
    });
    setIsLoading(false);
  }, []);

  function handleClick() {
    setIsLoading(true);
    handleAction().finally(() => setIsLoading(false));
  }
  async function handleAction() {
    if (pg === "sign-up") {
      if (
        !data.email ||
        !data.password ||
        data.password != data.password2 ||
        !data.check1
      ) {
        return showMsg("Please fill out all of the required fields", "error");
      }
      const { user, error } = await supabaseClient.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error(error);
        showMsg("Error signing up", "error");
        return setData(DEFAULT_DATA);
      } else {
        setData(DEFAULT_DATA);
        showMsg(
          "Please check your email for the confirmation link before logging in",
          "success"
        );
        return setTimeout(
          (r) => r.replace(`/auth?${QSP.page}=login`),
          3000,
          router
        );
      }
    }
    if (pg === "login") {
      if (!data.email || !data.password) {
        return showMsg("Please fill out all of the required fields", "error");
      }
      const { user, error } = await supabaseClient.auth.signIn({
        email: data.email,
        password: data.password,
      });
      if (error) {
        console.error(error);
        showMsg("Login failed", "error");
        return setData(DEFAULT_DATA);
      } else {
        router.replace("/");
      }
    }
    if (pg === "forgot") {
      if (!data.email) {
        return showMsg("Please fenter your email", "error");
      }
      const { data: fPassData, error } =
        await supabaseClient.auth.api.resetPasswordForEmail(data.email);

      if (error) {
        console.error(error);
        return showMsg("Error sending email", "error");
      } else {
        return showMsg("Please check your email for the link", "success");
      }
    }
  }
  async function handleSocial(provider: Provider) {
    if (pg === "sign-up") {
      const { user, session, error } = await supabaseClient.auth.signUp({
        provider,
      });
      if (error) {
        console.error(error);
        return showMsg(`Sign up via ${provider} failed.`, "error");
      }
    } else {
      const { user, session, error } = await supabaseClient.auth.signIn({
        provider,
      });
      if (error) {
        console.error(error);
        return showMsg(`Login via ${provider} failed.`, "error");
      }
    }
  }

  function getPgData() {
    if (pg === "sign-up") {
      return {
        title: "Sign Up",
        hasPassConfirm: true,
        hasPassword: true,
        hasEmail: true,
        hasSignupLink: false,
        hasLoginLink: true,
        hasForgotLink: true,
        check1Text: (
          <Text>
            I accept the{" "}
            <Link href="/terms" passHref>
              <Anchor target="_blank">terms and conditions</Anchor>
            </Link>
          </Text>
        ),
        buttonText: "Sign up",
        socialTitle: "Signup with a social provider",
      };
    }
    if (pg === "login") {
      return {
        title: "Login",
        hasPassConfirm: false,
        hasPassword: true,
        hasEmail: true,
        hasSignupLink: true,
        hasLoginLink: false,
        hasForgotLink: true,
        check1Text: "",
        buttonText: "Login",
        socialTitle: "Login with a social provider",
      };
    }
    if (pg === "forgot") {
      return {
        title: "Forgot Password",
        hasPassConfirm: false,
        hasPassword: false,
        hasEmail: true,
        hasSignupLink: true,
        hasLoginLink: true,
        hasForgotLink: false,
        buttonText: "Send recovery email",
      };
    }

    // reset password?
    return {
      title: "Reset Password",
      hasPassConfirm: true,
      hasPassword: true,
      hasEmail: true,
      hasSocial: true,
      hasSignupLink: false,
      hasLoginLink: true,
      hasForgotLink: true,
      check1Text: "",
    };
  }
  const pgData = getPgData();
  return (
    <Container>
      <Text align="center" size="xl" sx={{ marginTop: 10, marginBottom: 10 }}>
        {pgData.title}
      </Text>
      <Card
        shadow="sm"
        p="lg"
        radius="md"
        withBorder
        sx={(theme) => ({
          //   backgroundColor: theme.colors.white[3],
        })}
      >
        {error && (
          <Text color="red" align="center" size="md">
            {error.message}
          </Text>
        )}
        {pgData.hasEmail && (
          <TextInput
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            label="email"
            disabled={isLoading}
            required
          />
        )}
        {pgData.hasPassword && (
          <PasswordInput
            type="password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            label="Password"
            disabled={isLoading}
            required
          />
        )}
        {pgData.hasPassConfirm && (
          <PasswordInput
            type="password"
            value={data.password2}
            onChange={(e) => setData({ ...data, password2: e.target.value })}
            label="Confirm"
            disabled={isLoading}
            required
          />
        )}
        {pgData.check1Text && (
          <Checkbox
            sx={{ marginTop: 5 }}
            label={pgData.check1Text}
            checked={data.check1}
            disabled={isLoading}
            onChange={(e) =>
              setData({ ...data, check1: e.currentTarget.checked })
            }
          />
        )}
        <Button
          sx={{
            marginTop: 20,
            marginBottom: 35,
            marginRight: 0,
            marginLeft: "auto",
          }}
          onClick={handleClick}
          disabled={
            isLoading ||
            (pg === "login" && (!data.email || !data.password)) ||
            (pg === "sign-up" &&
              (!data.email ||
                !data.password ||
                data.password !== data.password2 ||
                !data.check1)) ||
            (pg === "forgot" && !data.email)
          }
          color="dark"
          fullWidth
        >
          {pgData.buttonText}
        </Button>
        {pgData.hasForgotLink && (
          <>
            <Link href={`/auth?${QSP.page}=forgot`}>
              <Anchor>Forgot your password?</Anchor>
            </Link>
            <br />
          </>
        )}
        {pgData.hasSignupLink && (
          <>
            <Link href={`/auth?${QSP.page}=sign-up`}>
              <Anchor>Create an account</Anchor>
            </Link>
            <br />
          </>
        )}
        {pgData.hasLoginLink && (
          <Link href={`/auth?${QSP.page}=login`}>
            <Anchor>Already have an account? Login</Anchor>
          </Link>
        )}

        {pgData.socialTitle && (
          <>
            <br />
            <hr />
            <Text align="center">{pgData.socialTitle}</Text>
            <Button
              color="dark"
              fullWidth
              sx={{ marginTop: 15, marginBottom: 15 }}
              onClick={() => handleSocial("google")}
              disabled={isLoading}
            >
              <IconBrandGoogle />
              oogle
            </Button>
            <Button
              color="dark"
              fullWidth
              disabled={isLoading}
              onClick={() => handleSocial("facebook")}
            >
              <IconBrandFacebook />
              acebook
            </Button>
          </>
        )}
      </Card>
      <LoadingOverlay visible={isLoading} overlayBlur={1} />
    </Container>
  );
};

export default AuthPg;
