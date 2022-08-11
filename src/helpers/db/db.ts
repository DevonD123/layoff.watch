import { useQuery } from "@tanstack/react-query";
import {
  handleNonVisible,
  handleVisibleGenericErr,
  handleVisible,
  client,
} from "./helper";
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
