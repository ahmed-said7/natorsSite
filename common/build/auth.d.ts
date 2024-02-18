/// <reference types="qs" />
/// <reference types="express" />
import { JwtPayload } from 'jsonwebtoken';
declare global {
    namespace Express {
        interface Request {
            user: {
                _id: string;
                email: string;
                password: string;
                role: string;
                passwordChangedAt: Date;
                active: boolean;
            };
        }
    }
}
export interface payload extends JwtPayload {
    _id: string;
    email: string;
    password: string;
    role: string;
    passwordChangedAt: Date;
    active: boolean;
}
export declare const protect: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
//# sourceMappingURL=auth.d.ts.map