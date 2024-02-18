"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransport = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
;
;
class createTransport {
    constructor(user) {
        this.user = user;
    }
    ;
    transport() {
        return nodemailer_1.default.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "c5ee5aac939502",
                pass: "254ccd3148f88c"
            }
        });
    }
    ;
    options(subject, text) {
        const opts = { text, subject, to: this.user.email, from: "natours" };
        return this.transport().sendMail(opts);
    }
    ;
}
exports.createTransport = createTransport;
;
