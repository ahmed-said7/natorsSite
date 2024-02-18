/// <reference types="qs" />
/// <reference types="express" />
import { Field } from "multer";
export declare function uploadSingleImage(field: string): import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare function uploadMultipleImages(fields: Field[]): import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const resizeSingleImage: (field: string) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const resizeMultipleImages: (multiImg: string, singleImg: string) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
//# sourceMappingURL=image.d.ts.map