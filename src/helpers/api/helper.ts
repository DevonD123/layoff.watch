import { NextApiRequest } from "next"
import {SupabaseClient} from "@supabase/supabase-js"

export const isAllowedMethod = (allowed: string[] | string,req: NextApiRequest) => {
    if(Array.isArray(allowed)){
        return allowed.includes(req.method || 'GET')
    }
    return req.method === allowed
}

export const checkIfNotAdmin = async (req: NextApiRequest, supabaseClient:SupabaseClient ) => {
    const {user,error} = await supabaseClient.auth.api.getUserByCookie(req)
  
  if(error){
    console.error(error)
    return { msg:"This function is only available to site admins.",status:401}
  }
  if(!user || !user.user_metadata || !user.user_metadata.isAdmin){
    console.error('Not admin cookies: ',req.cookies,' user: ',user)
    return { msg:"Error request failed",status:401}
  }
  return null
}

export const addIfNotUndefined = (result:any,key:string,value:any) => {
    if(value === undefined){
        return result
    }
    return {...result,[key]:value}
}