class ApiFeatures {
  constructor(model, reqQuery) {
    this.model = model;
    this.reqQuery = reqQuery;
  };

  filter() {
    const excludedFields = ["fields", "sort", "limit","page"];
    const queryObj = {...this.reqQuery};

    excludedFields.map( f => 
      delete queryObj[f]
    );

    let reqObj = JSON.stringify(queryObj);
    reqObj = reqObj.replace(/\b(gte|gt|lte|lt|ne)\b/g, w => `$${w}`);

    const parsedObj = JSON.parse(reqObj);
    this.model = this.model.find(parsedObj);

    return this;
  };

  sort() {
    if(this.reqQuery.sort) {
      const sortBy = this.reqQuery.sort.split(',').map(s => s.trim()).join(' ');
      this.model = this.model.sort(sortBy)
    }else{
      this.model = this.model.sort('title');
    };
    return this;
  };

  limitFields() {
    if(this.reqQuery.fields) {
      const fields = this.reqQuery.fields.split(',').map(f => f.trim()).join(' ');
      this.model = this.model.select(fields);
    }else{
      this.model = this.model.select('-__v');
    };
    return this;
  };

  paginate() {
    const page = this.reqQuery.page || 1;
    const limit = this.reqQuery.limit || 10;
    const skip = (page - 1) * limit;

    this.model = this.model.skip(skip).limit(limit);

    return this;
  };

  async execute() {
    this.filter().sort().limitFields().paginate();
    return await this.model;
  };
};

module.exports = ApiFeatures;