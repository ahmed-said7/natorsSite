"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiFeatures = void 0;
;
;
class apiFeatures {
    constructor(query, queryObj) {
        this.query = query;
        this.queryObj = queryObj;
        this.paginationObj = {};
    }
    ;
    filter(obj = {}) {
        let filter = Object.assign(Object.assign({}, this.queryObj), obj);
        let fields = ['keyword', 'page', 'limit', 'select', 'sort'];
        fields.forEach((field) => { delete filter[field]; });
        let queryStr = JSON.stringify(filter);
        queryStr = queryStr.replace(/lt|gt|lte|gte/g, val => `$${val}`);
        filter = JSON.parse(queryStr);
        this.query = this.query.find(Object.assign({}, filter));
        return this;
    }
    ;
    sort() {
        if (this.queryObj.sort) {
            const sort = this.queryObj.sort.split(',').join(' ');
            this.query = this.query.sort(sort);
        }
        ;
        return this;
    }
    ;
    select() {
        if (this.queryObj.select) {
            const select = this.queryObj.select.split(',').join(' ');
            this.query = this.query.select(select);
        }
        ;
        return this;
    }
    ;
    search() {
        if (this.queryObj.keyword) {
            const keyword = this.queryObj.keyword;
            this.query = this.query.find({ $text: { $search: keyword } });
        }
        ;
        return this;
    }
    ;
    pagination() {
        return __awaiter(this, void 0, void 0, function* () {
            this.paginationObj.numOfPages = (yield (this.query.model.find(Object.assign({}, this.query.getQuery())))).length;
            this.paginationObj.currentPage = this.queryObj.page ? parseInt(this.queryObj.page) : 1;
            this.paginationObj.limit = this.queryObj.limit ? parseInt(this.queryObj.limit) : 10;
            this.paginationObj.skip = (this.paginationObj.currentPage - 1) * this.paginationObj.limit;
            if (this.paginationObj.currentPage > 1) {
                this.paginationObj.previousPage = this.paginationObj.currentPage - 1;
            }
            ;
            if (this.paginationObj.numOfPages > this.paginationObj.currentPage * this.paginationObj.limit) {
                this.paginationObj.nextPage = this.paginationObj.currentPage + 1;
            }
            ;
            this.query = this.query.skip(this.paginationObj.skip).limit(this.paginationObj.limit);
            return this;
        });
    }
    ;
}
exports.apiFeatures = apiFeatures;
;
