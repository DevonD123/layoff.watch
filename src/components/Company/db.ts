import { useQuery } from "@tanstack/react-query";
import {
  handleVisibleGenericErr,
  handleVisibleGenericErrWithCount,
} from "@h/db/helper";
import showMsg from "@h/msg";
import { supabase } from "@h/supabaseClient";
import { ICompanyInput } from "./types";
import { getValueForWholeNumber } from "./helper";
import { getRangeValues } from "@h/pghelper";

export function useCompanies() {
  return useQuery(["company"], () =>
    supabase
      .from("company")
      .select()
      .eq("is_draft", false)
      .eq("deleted", false)
      .then(handleVisibleGenericErr)
  );
}

export function useCompanyRecentLayoffs() {
  return useQuery(["company_recent"], () =>
    supabase
      .from("company")
      .select()
      .eq("is_draft", false)
      .eq("deleted", false)
      .limit(10)
      .then(handleVisibleGenericErr)
  );
}

export function usePagedCompanies(page?: number) {
  return useQuery(
    ["company_paged", { page }],
    async () => {
      const range = getRangeValues(page || 1);
      const response = await supabase
        .from("company")
        .select(`*`, { count: "exact" })
        .eq("deleted", false)
        .order("created_at")
        .range(range[0], range[1]);
      return handleVisibleGenericErrWithCount(response);
    },
    { enabled: typeof page !== "undefined", keepPreviousData: true }
  );
}

export async function addCompanyAsDraft({
  name,
  logo_url,
  ticker,
  description,
  est_employee_count,
}: ICompanyInput) {
  const { data, error } = await supabase.from("company").insert({
    name,
    logo_url: logo_url ? `https://logo.clearbit.com/${logo_url}` : undefined,
    ticker,
    description,
    est_employee_count: getValueForWholeNumber(est_employee_count),
    is_draft: true,
  });

  if (error || !data || data.length <= 0) {
    console.error(error);
    showMsg("Error adding company", "error");
    return null;
  }

  return data[0];
}
