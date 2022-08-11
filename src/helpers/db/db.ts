import { useQuery } from "@tanstack/react-query";
import {
  handleNonVisible,
  handleVisibleGenericErr,
  handleVisible,
  client,
} from "./helper";
import showMsg from "@h/msg";
import { supabase } from "../supabaseClient";

/* an example */
export function useUser(uid: string) {
  return useQuery(
    ["user", { uid }],
    () =>
      supabase
        .from("profiles")
        .select()
        .eq("id", uid)
        .single()
        .then(handleNonVisible),
    { enabled: !!uid }
  );
}

export function useCompanies() {
  return useQuery(
    ["company"],
    () =>
      supabase
        .from("company")
        .select()
        .eq("is_draft", false)
        .then(handleNonVisible),
    {}
  );
}

interface ICompanyInput {
  name: string;
  logo_url?: string;
  ticker?: string;
  description?: string;
  est_employee_count?: string;
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
    est_employee_count: est_employee_count
      ? parseInt(est_employee_count.split(",").join(""))
      : undefined,
    is_draft: true,
  });

  if (error || !data || data.length <= 0) {
    console.error(error);
    showMsg("Error adding company", "error");
    return null;
  }

  return data[0];
}
