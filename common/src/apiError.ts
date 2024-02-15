export class apiError extends Error {
    statusCode:number;
    isOperational:boolean=true;
    status:string;
    constructor(message:string,statusCode:number){
        super(message);
        this.statusCode = statusCode;
        this.status=`${this.statusCode}`.startsWith('4') ? "failed" : "error";
    };
};