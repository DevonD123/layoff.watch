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

export function useCompanyLayoffHistory(id: string) {
  return useQuery(
    ["useCompanyLayoffHistory", { id }],
    () =>
      supabaseClient
        .rpc("company_layoff_total", { c_id: id })
        .then(handleVisibleGenericErr),
    { enabled: !!id }
  );
}
