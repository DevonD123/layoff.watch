import { useQuery } from "@tanstack/react-query";
import { handleVisibleGenericErr } from "@h/db/helper";
import { ReportType } from "../Layoff/types";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";

export function useFreezeReports(company_id: string) {
  return useQuery(
    ["useFreezeReports", { company_id }],
    () =>
      supabaseClient
        .from("layoff")
        .select(`*`)
        .eq("company_id", company_id)
        .eq("type", ReportType.Freeze)
        .then(handleVisibleGenericErr),
    { enabled: !!company_id }
  );
}
