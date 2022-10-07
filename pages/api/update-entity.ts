import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import {routeMap,RouteName} from '@c/Layout/AdminEdit'
import {initMetaData,createJsonRepsonse} from '@h/api/metadata'
import validate, { createError, isInvalid } from "@h/api/validation";
import { addIfNotUndefined } from "@h/api/helper";


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET;

export const supabase = createClient(supabaseUrl!, supabaseSecretKey!);

export interface StatusBody {
  table: RouteName;
  data:any;
  id:string;
}
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const metaData = initMetaData(req)
  const body:StatusBody = JSON.parse(req.body)
  if (req.method !== "PUT") {
    return res.status(405).json(createJsonRepsonse(metaData));
  }

  if (![RouteName.Company,RouteName.Exec,RouteName.ExecRole,RouteName.Position,RouteName.Report].includes(body.table)) {
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


  const {error:updateError} = await supabase.from(routeMap[body.table].tbl).update(mapBody(body.table,body.data,true,false)).match({id: body.id})

  if(updateError){
    console.error('update error: ',updateError)
    return res.status(500).json(createJsonRepsonse({...metaData,msg: "Error with update. the change did not go through"}));
  }
  return res.status(200).json(createJsonRepsonse({...metaData,msg: "Success"}))
}

export function mapBody(table: RouteName, body:any,isAdmin?:boolean,isAdd?:boolean){
    let result:any = addVerified(table,{},!!isAdmin,body.verified)

    const validationObj = validate(table, body)
        if(isInvalid(validationObj)){
            throw createError(validationObj) 
        }

    if(table === RouteName.Position){
        result.abbreviation = body.abbreviation
        result.name = body.name
        result = addIfNotUndefined(result,'description',body.description)
    }

    if(table === RouteName.Company){
        result.name = upperFirstChar(body.name)
        result = addIfNotUndefined(result,'ticker',body.ticker)
        result = addIfNotUndefined(result,'description',body.description)
        result = addIfNotUndefined(result,'est_employee_count',stripCommasFromNumber(body.est_employee_count))
        if(result.ticker){
            result.ticker = result.ticker.toUpperCase().trim()
        }
    }

    if(table === RouteName.Exec){
        const nameArr = body.name.split(' ')
        for(let i = 0; i < nameArr.length;i++){
            nameArr[i] = upperFirstChar(nameArr[i])
        }
        result.name = nameArr.join(' ')
        result = addIfNotUndefined(result,'bio',body.bio)
    }

    if(table === RouteName.ExecRole){
        result.role = body.role.toUpperCase().trim()
        result.start = body.start
        result = addIfNotUndefined(result,'end',body.end)
        if(isAdd){
            result.company_id = body.company_id
            result.csuit_id = body.csuit_id
        }
    }

    if(table === RouteName.Report){
        result.title = upperFirstChar(body.title)
        result.type = body.type
        result.is_completed = body.is_completed
        result = addIfNotUndefined(result,'extra_info',body.extra_info)
        result = addIfNotUndefined(result,'source',body.source)
        result = addIfNotUndefined(result,'source_display',body.source_display)
        //layoff
        if(body.type === 1){
            result = addIfNotUndefined(result,'number',body.number)
            result = addIfNotUndefined(result,'percent',body.percent)
        }
        //pip
        if(body.type === 5){
            result.number = null
            result.percent = body.is_completed ? null : body.percent
        }
        //freeze
        if(body.type === 10){
            result.number = null
            result.percent = null
        }

        if(isAdd){
            result.company_id = body.company_id
            // TODO add position links
        }
    }


    if(Object.keys(result).length <= 0){
        throw new Error("No values changed")
    }
    return result
}


const stripCommasFromNumber = (val?: string|number|null) => {
    if(typeof val === 'string'){
        const res =  parseInt(val.replaceAll(',',''))
        if(isNaN(res)){
            return null
        }
        return res
    }
    return val
}

const upperFirstChar = (str:string) => {
    return str[0].toUpperCase() + str.substring(1)
}

const addVerified = (table: RouteName,results:any, isAdmin:boolean, verifiedValue?: boolean) => {
    if(!isAdmin || table === RouteName.Position){
        return results
    }
    return {...results,verified: verifiedValue || false}
}


export default handler