import { useQuery } from "@tanstack/react-query";
import {
  handleNonVisible,
  handleVisibleGenericErr,
  handleVisible,
  client,
} from "./helper";
import showMsg from "@h/msg";
import { supabase } from "../supabaseClient";

export function usePositions() {
  return useQuery(["position"], () =>
    supabase
      .from("position")
      .select()
      .eq("is_draft", false)
      .then(handleVisibleGenericErr)
  );
}

interface IPositionInput {
  name: string;
  abbreviation?: string;
}
export async function addPositionAsDraft({
  name,
  abbreviation,
}: IPositionInput) {
  const { data, error } = await supabase.from("position").insert({
    name,
    abbreviation,
    is_draft: true,
  });

  if (error || !data || data.length <= 0) {
    console.error(error);
    showMsg("Error adding position", "error");
    return null;
  }

  return data[0];
}
