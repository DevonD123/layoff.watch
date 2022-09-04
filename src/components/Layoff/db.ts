import { useQuery } from "@tanstack/react-query";
import {
  handleVisibleGenericErr,
  handleVisibleGenericErrWithCount,
} from "@h/db/helper";
import showMsg from "@h/msg";
import { supabase } from "@h/supabaseClient";
import { getRangeValues } from "@h/pghelper";
import { IReportData } from "./types";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";

export async function addLayoffAsDraft({
  title,
  source,
  source_display,
  number,
  percent,
  layoff_date,
  company_id,
  sub_email,
  extra_info,
  add_to_job_board,
  csuit_ids,
  position_ids,
}: IReportData) {
  let errCount = 0;
  if (!title) {
    console.error("No title provided");
    showMsg("Please add a title", "error");
    errCount += 1;
  }
  if (!company_id) {
    console.error("No comapny ID");
    showMsg("Please add a company", "error");
    errCount += 1;
  }
  if (errCount >= 1) {
    return null;
  }
  const { data, error } = await supabase.from("layoff").insert({
    title,
    source,
    source_display,
    number,
    percent,
    layoff_date,
    company_id,
    sub_email,
    extra_info,
    add_to_job_board,
    is_draft: true,
  });

  if (error || !data || data.length <= 0) {
    console.error("Layoff err");
    console.error(error);
    showMsg("Error adding layoff report", "error");
    return null;
  }

  if (csuit_ids && csuit_ids.length >= 1 && data[0].id) {
    const arr = [];
    for (let i = 0; i < csuit_ids.length; i++) {
      arr.push({
        layoff_id: data[0].id,
        csuit_id: csuit_ids[i],
        is_draft: true,
      });
    }

    const { data: csuit, error: csuitErr } = await supabase
      .from("csuit_layoff")
      .insert(arr);

    if (csuitErr || !csuit || csuit.length <= 0) {
      console.error("Csuit err");
      console.error(csuitErr);
      showMsg("Error adding execs to the report", "error");
      return null;
    }
  }

  if (position_ids && position_ids.length >= 1 && data[0].id) {
    const arr = [];
    for (let i = 0; i < position_ids.length; i++) {
      arr.push({
        layoff_id: data[0].id,
        position_id: position_ids[i],
        is_draft: true,
      });
    }

    const { data: posData, error: posErr } = await supabase
      .from("position_layoff")
      .insert(arr);

    if (posErr || !posData || posData.length <= 0) {
      console.error("Position err");
      console.error(posErr);
      showMsg("Error adding position to the report", "error");
      return null;
    }
  }

  showMsg(
    "Thank you for submitting a report! Staff will review it and we will be in contact via the email you provided",
    "success",
    undefined,
    "long"
  );
  return data[0];
}

export function useLayoutPgData(id: string) {
  return useQuery(
    ["layout", { id }],
    () =>
      supabaseClient
        .from("layoff")
        .select(
          `*,
          company(*),
          position_layoff(position(*)),
          csuit_layoff(csuit(*))
        `
        )
        .eq("id", id)
        .single()
        .then(handleVisibleGenericErr),
    { enabled: !!id }
  );
}
