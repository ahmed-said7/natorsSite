import {createTransport} from "@natour/common";

export interface User {
    email: string;
    name: string;
};

export class sendMail extends createTransport {
    constructor(user:User){
        super(user);
    };
    sendRandomCode(code:string){
        
        const subject=`hi ${this.user.name} , your reset code to change your password`;
        const text=`reset code to change password is ${code}`;
        return this.options(subject, text);
    };
    static Instance(user:User){
        return new sendMail(user);
    };
};