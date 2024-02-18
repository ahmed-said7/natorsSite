/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import mongoose, { Model } from "mongoose";
export interface Pobulate {
    path: string;
    select: string;
}
export interface t {
    page?: string;
    sort?: string;
    select?: string;
    limit?: string;
    keyword?: string;
}
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
import { Request, Response, NextFunction } from "express";
import { subjectType } from "./enums";
declare global {
    namespace Express {
        interface Request {
            filterObj?: {
                [key: string]: string;
            };
        }
    }
}
export interface Publisher<d> {
    publish(data: d): void;
    channelName: subjectType;
}
export interface hasId {
    _id?: any;
    version?: any;
    [key: string]: any;
}
interface k extends mongoose.Document {
    _id?: mongoose.Types.ObjectId;
    version?: number;
    passwordChangedAt?: Date;
    active?: boolean;
    [key: string]: any;
}
export declare class apiFactory<T extends mongoose.Document, m extends t, h extends hasId> {
    model: Model<T>;
    auth?: mongoose.Model<k, {}, {}, {}, mongoose.Document<unknown, {}, k> & k & Required<{
        _id: mongoose.Types.ObjectId;
    }>, any> | undefined;
    options?: Pobulate | undefined;
    private publisherCreated;
    private publisherUpdated;
    private publisherDeleted;
    constructor(model: Model<T>, auth?: mongoose.Model<k, {}, {}, {}, mongoose.Document<unknown, {}, k> & k & Required<{
        _id: mongoose.Types.ObjectId;
    }>, any> | undefined, options?: Pobulate | undefined);
    setPublisher(publisherCreated?: Publisher<h>, publisherUpdated?: Publisher<h>, publisherDeleted?: Publisher<h>): void;
    getOne(req: Request<{
        id: string;
    }, {}, {}, {}>, res: Response, next: NextFunction): Promise<void>;
    createOne(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateOne(req: Request<{
        id: string;
    }, {}, {}, {}>, res: Response, next: NextFunction): Promise<void>;
    deleteOne(req: Request<{
        id: string;
    }, {}, {}, t>, res: Response, next: NextFunction): Promise<void>;
    getAll(req: Request<{}, {}, {}, m>, res: Response, next: NextFunction): Promise<void>;
    protect(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const allowedTo: (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=apiFactory.d.ts.map