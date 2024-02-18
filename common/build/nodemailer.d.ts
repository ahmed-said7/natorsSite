import nodemailer from "nodemailer";
export interface User {
    email: string;
    name: string;
}
export interface Options {
    from: string;
    to: string;
    subject: string;
    text: string;
}
export declare abstract class createTransport {
    user: User;
    constructor(user: User);
    transport(): nodemailer.Transporter<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
    options(subject: string, text: string): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
}
//# sourceMappingURL=nodemailer.d.ts.map