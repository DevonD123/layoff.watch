import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "@tanstack/react-query";
import { handleVisibleGenericErr } from "@h/db/helper";

export function useRecentCompany() {
  return useQuery(
    ["useRecentCompany"],
    () =>
      supabaseClient
        .rpc("recent_company_layoffs")
        .then(handleVisibleGenericErr),
    {}
  );
}

export function fetchLayoffById(id: string) {
  return supabaseClient
    .from("layoff")
    .select(
      `
               id,
               title,
               company_id,
               number,
               layoff_date,
               percent,
               company(name,logo_url)
    `
    )
    .eq("id", id)
    .single();
}
