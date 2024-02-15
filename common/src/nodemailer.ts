import nodemailer from "nodemailer";
export interface User {
    email: string;
    name: string;
};

export interface Options {
    from: string;
    to: string;
    subject: string;
    text:string;
};

export abstract class createTransport {
    constructor( public user:User ){};
    transport(){
        return nodemailer.createTransport(
        {
            host:"smtp.mailtrap.io",
            port:2525,
            auth:{
                user:"c5ee5aac939502",
                pass: "254ccd3148f88c"
            }
        }
        );
    };
};