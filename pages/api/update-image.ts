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

  /* Only for delete */
  doDelete?:boolean;

  /* Will replace old img */
  newUrl?:string;
}
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const metaData = initMetaData(req)
  const body:StatusBody = JSON.parse(req.body)
  if (req.method !== "PUT") {
    return res.status(405).json(createJsonRepsonse(metaData));
  }

  if (![RouteName.Company,RouteName.Exec].includes(body.table)) {
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
  
  if(body.doDelete){
    const deleteData:any = {}
    if(body.table === RouteName.Company){
        const {data} = await supabase.from(routeMap[body.table].tbl).select('uploaded_logo_key').eq('id', body.id).maybeSingle()
        deleteData.uploaded_logo_key = null;
        if(!data?.uploaded_logo_key){
            deleteData.logo_url = null;
        }
    }else{
        deleteData.img_url = null;
    }
    console.info('delete data ',deleteData, ' table ',body.table, ' reqId ',metaData.reqId,' singleReq: ',metaData.singleReqId)
    const {error:deletImgErr} = await supabase.from(routeMap[body.table].tbl).update(deleteData).match({id: body.id})  

    if(deletImgErr){
        console.error('delete error: ',deletImgErr)
        return res.status(500).json(createJsonRepsonse({...metaData,msg: "Error with delete. the change did not go through"}));
    }
     return res.status(200).json(createJsonRepsonse({...metaData,msg: "Image deleted successfully"})) 
  }

  const updateData:any = {}
  if(body.table === RouteName.Company){
    updateData.uploaded_logo_key = null;
    if(body.newUrl?.startsWith('http')){
            updateData.logo_url = body.newUrl
    }else{
        updateData.uploaded_logo_key = body.newUrl
    }
  }else{
    updateData.img_url = body.newUrl
  }
  console.info('updated data ',updateData, ' table ',body.table, ' reqId ',metaData.reqId,' singleReq: ',metaData.singleReqId)

  const {error:updateError} = await supabase.from(routeMap[body.table].tbl).update(updateData).match({id: body.id})

  if(updateError){
    console.error('update image error: ',updateError)
    return res.status(500).json(createJsonRepsonse({...metaData,msg: "Error updating image. the change did not go through"}));
  }
  return res.status(200).json(createJsonRepsonse({...metaData,msg: "Image replaced successfully"}))
}


export default handler