import { useQuery } from "@tanstack/react-query";
import { handleVisibleGenericErr } from "@h/db/helper";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";

export function useAllPositions() {
  return useQuery(
    ["useAllPositions"],
    () =>
      supabaseClient
        .from("position")
        .select(`*`)
        .eq("deleted", false)
        .then(handleVisibleGenericErr),
    {}
  );
}

export function usePositionsById(id: string) {
  return useQuery(
    ["usePositionsById", { id }],
    () =>
      supabaseClient
        .from("position")
        .select(`*`)
        .eq("deleted", false)
        .eq("id", id)
        .single()
        .then(handleVisibleGenericErr),
    { enabled: !!id }
  );
}
