import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import {routeMap,RouteName} from '@c/Layout/AdminEdit'
import {initMetaData,createJsonRepsonse} from '@h/api/metadata'


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET;

export const supabase = createClient(supabaseUrl!, supabaseSecretKey!);

export interface StatusBody {
  id: string;
  table: RouteName;
  doUnverify?:boolean
}
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const metaData = initMetaData(req)
  const body:StatusBody = JSON.parse(req.body)
  if (req.method !== "PUT") {
    return res.status(405).json(createJsonRepsonse(metaData));
  }

  if (![RouteName.Company,RouteName.Exec,RouteName.Position,RouteName.Report].includes(body.table)) {
    console.error("Invlaid table type", body.table);
    return res.status(500).json(createJsonRepsonse({...metaData,msg: "Invalid Entity!"}));
  }

  if (!body.id) {
    console.error("Invlaid id ", body.id);
    return res.status(500).json(createJsonRepsonse({...metaData,msg: "Please refresh and try again"}));
  }

  const {user,error} = await supabase.auth.api.getUserByCookie(req)
  
  if(error){
    console.error(error)
    return res.status(401).json(createJsonRepsonse({...metaData,msg: "Error request failed"}));
  }
  if(!user || !user.user_metadata || !user.user_metadata.isAdmin){
    console.error('Not admin cookies: ',req.cookies,' user: ',user)
    
    return res.status(401).json(createJsonRepsonse({...metaData,msg: "This function is only available to site admins."}));
  }


  const {data,error:updateError} = await supabase.from(routeMap[body.table].tbl).update({
    verified:body.doUnverify ? false : true
  }).match({id: body.id})

  if(updateError){
    console.error('update error: ',updateError)
    return res.status(500).json(createJsonRepsonse({...metaData,msg: "Error with update. the change did not go through"}));
  }
  return res.status(200).json(createJsonRepsonse({...metaData,msg: "Success"}))
}


export default handler