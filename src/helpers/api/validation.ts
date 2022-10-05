import { RouteName } from "@c/Layout/AdminEdit";

interface IValidationData {
    [key:string]: string
}

export default function validate(table: RouteName,data:any){
    const errorObj:IValidationData = {}
    if(table === RouteName.Position){
        if(!data.name){
            errorObj.name = "Name required"
        }
        if(!data.abbreviation){
            errorObj.abbreviation = "Abbreviation required"
        }
    }

    if(table === RouteName.Company){
        if(!data.name){
            errorObj.name = "Name required"
        }
    }

    if(table === RouteName.Exec){
       if(!data.name){
            errorObj.name = "Name required"
        }
        if(!data.name.trim().includes(' ')){
            errorObj.name = "First and last name required"
        }
    }

    if(table === RouteName.ExecRole){
        if(!data.start){
            errorObj.start = "Must have a start date"
        }
        if(!data.role){
            errorObj.role = "Role required"
        }
        if(!data.csuit_id){
            errorObj.csuit_id = "Exec id required"
        }
        if(!data.company_id){
            errorObj.company_id = "Company id required"
        }
    }

    if(table === RouteName.Report){
        if(!data.title){
            errorObj.title = "Must have a title"
        }
        if(!data.layoff_date){
            errorObj.layoff_date = "Affective date required"
        }
        if(!data.company_id){
            errorObj.company_id = "Company id required"
        }

        // layoff
        //if(data.type === 1){}
        if(!data.is_completed){
            //pip
            if(data.type === 5 && (!data.percent || data.percent <= 0) ){
                errorObj.percent = 'Pip target % is required'
            }
            //freeze
            // if(data.type === 10){}
        }
    }

    return errorObj
}

export const isInvalid = (errorObj: IValidationData) => {
    return Object.keys(errorObj).length >= 1
}

export const createError = (errorObj: IValidationData) => {
    const keys = Object.keys(errorObj)
    if(keys.length <= 0){
        return null
    }
    let str = ''
    for(let i = 0; i < keys.length; i++){
        str += `${keys[i]}: ${errorObj[keys[i]]} `
    }
    return new Error(str)
}