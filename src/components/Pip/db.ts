import { useQuery } from "@tanstack/react-query";
import { handleVisibleGenericErr } from "@h/db/helper";
import { ReportType } from "../Layoff/types";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";

export function usePipReports(company_id: string) {
  return useQuery(
    ["usePipReports", { company_id }],
    () =>
      supabaseClient
        .from("layoff")
        .select(`*`)
        .eq("company_id", company_id)
        .eq("type", ReportType.Pip)
        .then(handleVisibleGenericErr),
    { enabled: !!company_id }
  );
}
