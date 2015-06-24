# ElasticsearchCSV [![Build Status](https://secure.travis-ci.org/robertstettner/elasticsearch-csv.svg?branch=master)](http://travis-ci.org/robertstettner/elasticsearch-csv) [![Coverage Status](https://coveralls.io/repos/robertstettner/elasticsearch-csv/badge.svg)](https://coveralls.io/r/robertstettner/elasticsearch-csv)

A simple Elasticsearch CSV importer node.js library.

Features:
- Import any text file with a delimiter
- Uses Elasticsearch options and bulk request API

## Getting Started

Install it for use in node.js:
```
npm install elasticsearch-csv
```

```javascript
var ElasticsearchCSV = require('elasticsearch-csv');

// create an instance of the importer with options
var esCSV = new ElasticsearchCSV({
    es: { index: 'my_index', type: 'my_type', host: '192.168.0.1' },
    csv: { filePath: '/home/foo/bar/mycsv.csv', headers: true }
});

esCSV.import()
    .then(function (response) {
        // Elasticsearch response for the bulk insert
        console.log(response);
    }, function (err) {
        // throw error
        throw err;
    });
```

## Release notes

### 0.0.1
- Initial release
