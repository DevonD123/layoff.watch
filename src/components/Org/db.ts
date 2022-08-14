import { useQuery } from "@tanstack/react-query";
import { handleVisibleGenericErr } from "@h/db/helper";
import showMsg from "@h/msg";
import { supabase } from "@h/supabaseClient";
import { IOrgInput } from "./types";
import { getValueForWholeNumber } from "@c/Company/helper";

export function useOrg(company_id?: string) {
  return useQuery(
    ["orgs", { company_id }],
    () =>
      supabase
        .from("org")
        .select()
        .eq("is_draft", false)
        .then(handleVisibleGenericErr),
    { enabled: !!company_id }
  );
}

export async function addOrgAsDraft({
  name,
  abbreviation,
  company_id,
  description,
  est_employee_count,
}: IOrgInput) {
  if (!company_id) {
    console.error("No Company_Id on create org");
    return showCreateErr();
  }
  const { data, error } = await supabase.from("org").insert({
    name,
    abbreviation,
    description,
    company_id,
    est_employee_count: getValueForWholeNumber(est_employee_count),
    is_draft: true,
  });

  if (error || !data || data.length <= 0) {
    console.error(error);
    return showCreateErr();
  }

  return data[0];
}

function showCreateErr() {
  showMsg("Error adding org", "error");
  return null;
}
