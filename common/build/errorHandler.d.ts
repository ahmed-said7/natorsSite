import { NextFunction, Request, Response } from "express";
export interface MongoError {
    driver?: boolean;
    code?: number;
    name?: string;
    statusCode?: number;
    status?: string;
    errmsg: string;
    index?: string;
}
export declare enum environment {
    development = "development",
    production = "production"
}
export declare const errorHandler: (env: environment) => (error: any, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
//# sourceMappingURL=errorHandler.d.ts.map