// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET;

export const supabase = createClient(supabaseUrl!, supabaseSecretKey!);

interface IStatusReq extends Omit<NextApiRequest, "body"> {
  body: StatuBody;
}
export interface StatuBody {
  id: string;
  entity: "csuit" | "company" | "org" | "position";
  action: "approve" | "deny" | "delete";
}
const successMsg = {
  approve: "Approved",
  deny: "Denied",
  delete: "Deleted",
};
export default async function handler(req: IStatusReq, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405);
  }

  if (!["csuit", "company", "org", "position"].includes(req.body.entity)) {
    console.error("Invlaid entity", req.body.entity);
    return res.status(500).json({ msg: "Invalid Entity!" });
  }

  const { data, error } = await supabase
    .from(req.body.entity)
    .update(
      req.body.action === "approve" ? { is_draft: false } : { deleted: true }
    )
    .match({
      id: req.body.id,
    });

  if (error) {
    console.error("error form supabase:", error);
    return res.status(400).json({ msg: "Error" });
  }
  if (!data || data.length <= 0) {
    console.error("error no data", data);
    return res.status(400).json({ msg: "Error" });
  }
  res.status(200).json({ msg: successMsg[req.body.action] });
}
