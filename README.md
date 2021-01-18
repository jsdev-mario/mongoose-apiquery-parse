# mongoose-apiquery-parse

## Install

```
$ npm install mongoose-apiquery-parse
```

## How to use

```javascript
const queryParse = require('mongoose-apiquery-parse');

app.get('/', (req,res) => {
    cosnt {query, sort_quey, skip, limit} = queryParse(req.query)
    Model.find(query).sort(sort_query).skip(skip).limit(limit)
    ....
});



```
## query example
```javascript
https://example.com/users?email.or=jaon@outlook.com,benzcruise@gmail.com&account_type.or=social,standard&skip=0&limit=2&sort_by=email,createdAt&order_by=asc,desc&createdAt.gte=2020-07-10&createdAt.lte=2020-12-31&email.ne=jaon@outlook.com&address.city.ne=newyork&name.in=ju

```
| query  | result |
| ------------- | ------------- |
| name=John Michael | query -> {name: 'John Michael'} |
| name.ne=John Michael | query -> {name: {$ne: 'John Michael'}}  |
| gender.or=Male,Female | query ->  {$or: [{gender: 'Male'}, {gender: 'Female'}]}  |
| address.city=New York | query -> {'address.city': 'New York'} |
| age.gte=30&age.lte=50 | query -> {age: {$gte: 30, $lte: 50}} |
| skip=0&limit=2 | skip -> 0, limit -> 2 |
| sort_by=email,date&order_by=asc,desc | sort_query -> {{ email: 'asc', date: 'desc' }}  |




### The MIT License (MIT)

Copyright (c) <2020> w3ever
