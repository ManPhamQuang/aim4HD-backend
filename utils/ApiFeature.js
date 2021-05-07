const { query } = require("express");

class ApiFeature {
    constructor(query, queryObj) {
        this.query = query;
        this.queryObj = queryObj;
    }

    filter() {
        const queryObjForFilter = { ...this.queryObj };
        const excludeFields = ["sort", "page", "limit", "fields", "query"];
        excludeFields.forEach((field) => delete queryObjForFilter[field]);
        if (this.queryObj.aiming && this.queryObj.aiming.includes(",")) {
            let aiming = this.queryObj.aiming.split(",");
            queryObjForFilter.aiming = { $in: aiming };
        }
        this.query.find(queryObjForFilter);
        return this;
    }

    sort() {
        if (this.queryObj.sort) {
            const sortCriteria = this.queryObj.sort.replace(/,/g, " ");
            this.query.sort(sortCriteria);
        } else {
            this.query.sort("createdAt");
        }
        return this;
    }

    field() {
        if (this.queryObj.fields) {
            const chosenFields = this.queryObj.fields.replace(/,/g, " ");
            this.query.select(chosenFields);
        } else {
            this.query.select("-__v");
        }
        return this;
    }

    paginate() {
        const currentPage = parseInt(this.queryObj.page) || 1;
        const pageSize = parseInt(this.queryObj.limit) || 3;
        const skip = (currentPage - 1) * pageSize;
        this.query.skip(skip).limit(pageSize);
        return this;
    }
}

module.exports = ApiFeature;
