import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "@tanstack/react-query";
import {
  handleVisibleGenericErr,
  handleVisibleGenericErrWithCount,
} from "@h/db/helper";

export function useLayoffMSummary() {
  return useQuery(
    ["useLayoffMSummary"],
    () => supabaseClient.rpc("per_month_last_2y").then(handleVisibleGenericErr),
    {}
  );
}
