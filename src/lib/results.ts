import { HttpStatusCode } from "./statusCodes";

// export interface  IResult{
//     error: boolean;
//     statusCode: HttpStatusCode;
//     message: string;
//     result?: any
// }

export interface Result {
    error: boolean;
    statusCode: HttpStatusCode;
    message: string;
    result?: any
    total?: number
}


export class ResponseResult implements Result {
    error: boolean;
    statusCode: HttpStatusCode;
    message: string;
    result?: any;
    total?: number;
    constructor(error: boolean, statusCode: HttpStatusCode, message: string, result?:any, total?:  number){
        this.error =  error;
        this.statusCode = statusCode;
        this.message =  message;
        this.result =  result;
        this.total = result;
    }

    public  getStatusCode(){
        return this.statusCode
    }
    public getResult(){
        return this.result
    }
}