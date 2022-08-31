import { useEffect } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import QSP from "./qsp";

const useRequiredUser = () => {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  useEffect(() => {
    if (!user && !isLoading) {
      router.push({
        pathname: "/auth",
        query: {
          ...router.query,
          [QSP.page]: "login",
          [QSP.after_login]: router.pathname,
        },
      });
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return { user, isLoading };
};

export default useRequiredUser;
