const mongoose = require('mongoose')
module.exports = (req_query) => {

    const query = {}

    let sort_query = {}

    const skip = Number(req_query.skip) || 0
    const limit = Number(req_query.limit) || 0
    delete req_query.skip
    delete req_query.limit

    if (req_query.sort_by) {

        const sort_by_fields = req_query.sort_by.split(',').map(field => field.trim())
        let order_by_values = sort_by_fields.map(() => 'asc')

        if (req_query.order_by) {

            order_by_values = req_query.order_by.split(',').map(value => value.trim())
            if (sort_by_fields.length > order_by_values.length) {
                order_by_values = sort_by_fields.map((field, index) => order_by_values[index] || 'asc')
            }
        }

        sort_by_fields.forEach((key, index) => {
            sort_query[key] = order_by_values[index]
        })
        
        delete req_query.sort_by
        delete req_query.order_by
    }
   

    let or_keys = []

    Object.keys(req_query).forEach(key => {
        if (key.includes('.')) {

            range_keys = key.split('.').map(rk => rk.trim())
            range_primary_key = range_keys.slice(0, range_keys.length - 1).join('.')
            range_secondary_key = range_keys[range_keys.length - 1]

            if (range_secondary_key === 'or') {
                or_keys.push({key: key, primary: range_primary_key})
            }else if(range_secondary_key === 'in') {
                query[range_primary_key] = { $regex: req_query[key].toLowerCase(), $options: 'i' }
            }else{
                query[range_primary_key] = query[range_primary_key] || {}
                query[range_primary_key][`$${range_secondary_key}`] = Number(req_query[key]) ? Number(req_query[key]) : req_query[key]
            }
        }else{
            query[key] =  req_query[key]
        }
    })

    if (or_keys.length > 0) {

        query['$and'] = or_keys.map(or_key => {
            const or_query = {
                $or: req_query[or_key.key].split(',').map(v => v.trim()).map(v => {

                    const sub_query = {}
                    sub_query[or_key.primary] = Number(v) ? Number(v) : v
                    return sub_query
                })
            }
            return or_query
        })
    }

    // convert string id to mongoose id
    const newQuery = {}
    const convertToMongooseID = (data) => {
        if(typeof data == "object") {
            for(let [key, value] of Object.entries(data))
                newQuery[key] = convertValueType(value)
        }else {
            if(mongoose.isValidObjectId(data)) 
                return mongoose.Types.ObjectId(data);
            return data;
        }
    
    }
    convertToMongooseID(query)

    return {newQuery, sort_query, skip, limit}
};
