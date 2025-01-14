import { HttpStatus } from "../enums/HTTPstatus.enum";

export function createResponse<T>(status:HttpStatus,message:string,data?:T|null,error?:string|null){
return{
    status,
    message,
    data:data||null,
    error:error||null
}
}