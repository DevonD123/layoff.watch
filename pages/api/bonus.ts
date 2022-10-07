import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js"
import {initMetaData,createJsonRepsonse} from '@h/api/metadata'
import { isAllowedMethod, checkIfNotAdmin, addIfNotUndefined } from "@h/api/helper";


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET;

export const supabase = createClient(supabaseUrl!, supabaseSecretKey!);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const metaData = initMetaData(req)
  const body = JSON.parse(req.body)
  if (!isAllowedMethod(['POST','PUT','DELETE'],req)) {
    return res.status(405).json(createJsonRepsonse(metaData));
  }
  const isEdit = req.method === 'PUT'
  const isDelete = req.method === 'DELETE'

  if(!body.date || !body.company_id || !body.csuit_id || !body.amount || 
    (isEdit && !body.id)
    ){
    if(!isDelete || isDelete && !body.id){
        console.error('Invalid data: ',body, ' isEdit: ',isEdit,' isDelete ',isDelete)
        return res.status(400).json(createJsonRepsonse({...metaData,msg:"Invalid input"}))
    }
  }

  const adminResp = await checkIfNotAdmin(req,supabase)
  if(!!adminResp){
    return res.status(adminResp.status).json(createJsonRepsonse({...metaData,msg: adminResp.status}));
  }

  const mappedValues = isDelete? {}: mapBody(isEdit,body)
  let errorReult = null;
  if(isEdit){
      const {error} = await supabase.from('csuit_bonus').update(mappedValues).eq('id',body.id)
        errorReult = error
  }else if(isDelete){
        const {error} = await supabase.from('csuit_bonus').delete().eq('id',body.id)
        errorReult = error
  }else{
    const {error} = await supabase.from('csuit_bonus').insert(mappedValues)
        errorReult = error
  }
  if(errorReult){
    console.error(errorReult)
    return res.status(500).json(createJsonRepsonse({...metaData,msg:`Error ${isEdit? 'Updating': isDelete?'Deleting' :'Adding'} bonus`}))
  }
    

  return res.status(200).json(createJsonRepsonse({...metaData,msg: `Bonus ${isEdit?'Updated':isDelete?'Deleted':'Added'}`}))
}

const mapBody = (isEdit:boolean,body:any) => {
    let result = {
        verified: body.verified
    }
    result = conditionallyAddIfEdit(isEdit,result,'date',body.date)
    result = conditionallyAddIfEdit(isEdit,result,'amount',body.amount)
    result = conditionallyAddIfEdit(isEdit,result,'csuit_id',body.csuit_id)
    result = conditionallyAddIfEdit(isEdit,result,'company_id',body.company_id)
    return result
}

const conditionallyAddIfEdit = (isEdit:boolean, result:any, key:string, value:any) => {
    return isEdit? addIfNotUndefined(result,key,value): {...result,[key]:value}
}





export default handler