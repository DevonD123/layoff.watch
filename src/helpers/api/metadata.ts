import type { NextApiRequest } from "next";
import { v4 as uuidv4 } from "uuid";
export const initMetaData = (req:NextApiRequest) => {
    const newReqId = uuidv4()
    const start = performance.now()
    let passedId:string = ''
    try{
        const body = JSON.parse(req.body)
        if(body.reqId){
            passedId = body.reqId
        }
    }catch{}
    return ({
        reqId: passedId || newReqId  ,
        singleReqId: passedId?null:newReqId,
        start,
    })
}

export const createJsonRepsonse = (data:any) => ({...data,end:performance.now()})