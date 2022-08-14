import { useQuery } from "@tanstack/react-query";
import { handleVisibleGenericErr } from "@h/db/helper";
import showMsg from "@h/msg";
import { supabase } from "@h/supabaseClient";
import { ICompanyInput } from "./types";
import { getValueForWholeNumber } from "./helper";

export function useCompanies() {
  return useQuery(["company"], () =>
    supabase
      .from("company")
      .select()
      .eq("is_draft", false)
      .then(handleVisibleGenericErr)
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
