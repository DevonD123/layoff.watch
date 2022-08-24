import { useQuery } from "@tanstack/react-query";
import {
  handleVisibleGenericErr,
  handleVisibleGenericErrWithCount,
} from "@h/db/helper";
import showMsg from "@h/msg";
import { supabase } from "@h/supabaseClient";
import { getRangeValues } from "@h/pghelper";
import { ICSuitInput } from "./types";

export function useCSuitByCompanies(company_ids: string[]) {
  return useQuery(
    ["comapnies_csuit", { company_ids: company_ids.join(",") }],
    () =>
      supabase
        .from("csuit")
        .select()
        .eq("is_draft", false)
        .eq("deleted", false)
        .then(handleVisibleGenericErr),
    {
      enabled: company_ids && company_ids.length >= 1,
    }
  );
}
export function usePagedCsuit(page?: number) {
  return useQuery(
    ["csuit_paged", { page }],
    async () => {
      const range = getRangeValues(page || 1);
      const response = await supabase
        .from("csuit")
        .select(`*`, { count: "exact" })
        .eq("deleted", false)
        .order("created_at")
        .range(range[0], range[1]);
      return handleVisibleGenericErrWithCount(response);
    },
    { enabled: typeof page !== "undefined", keepPreviousData: true }
  );
}

export function useCSuitByCompany(company_id?: string) {
  return useQuery(
    ["company_csuit", { company_id }],
    () =>
      supabase
        .from("company_csuit")
        .select(`*, csuit(*)`)
        .eq("is_draft", false)
        .eq("company_id", company_id)
        .eq("deleted", false)
        .then(handleVisibleGenericErr),
    { enabled: !!company_id }
  );
}

export async function addCSuitAsDraft({
  name,
  bio,
  img_url,
  linked_in_url,
  role,
  company_id,
  start,
  end,
}: ICSuitInput) {
  const { data, error } = await supabase.from("csuit").insert({
    name,
    bio,
    img_url,
    linked_in_url,
    role,
    is_draft: true,
  });

  if (error || !data || data.length <= 0) {
    console.error(error);
    showMsg("Error adding exec", "error");
    return null;
  }

  const { data: link, error: linkErr } = await supabase
    .from("company_csuit")
    .insert({
      company_id,
      csuit_id: data[0].id,
      start,
      end,
      is_draft: true,
    });

  if (linkErr || !link || link.length <= 0) {
    console.error(linkErr);
    showMsg("Error adding exec", "error");
    return null;
  }

  return { ...link[0], csuit: data[0] };
}
