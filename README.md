ElasticsearchCSV<br/>[![Npm Version](https://img.shields.io/npm/v/elasticsearch-csv.svg)](https://www.npmjs.com/package/elasticsearch-csv) [![Build Status](https://secure.travis-ci.org/robertstettner/elasticsearch-csv.svg?branch=master)](http://travis-ci.org/robertstettner/elasticsearch-csv) [![Coverage Status](https://coveralls.io/repos/robertstettner/elasticsearch-csv/badge.svg)](https://coveralls.io/r/robertstettner/elasticsearch-csv) [![Dependency Status](https://david-dm.org/robertstettner/elasticsearch-csv.svg)](https://david-dm.org/robertstettner/elasticsearch-csv) [![devDependency Status](https://david-dm.org/robertstettner/elasticsearch-csv/dev-status.svg)](https://david-dm.org/robertstettner/elasticsearch-csv#info=devDependencies)
==============================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================
A simple Elasticsearch CSV importer node.js library.

Features:
- Import any text file using [Fast-csv](https://github.com/C2FO/fast-csv), its options for delimiters, headers, etc.
- Uses the official [Elasticsearch](https://github.com/elastic/elasticsearch-js) library, its options and bulk request API

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

### 0.0.3
- Added support to parse columns of JSON type

### 0.0.2
- Updated dependencies

### 0.0.1
- Initial release

## License

MIT <https://github.com/robertstettner/elasticsearch-csv/raw/master/LICENSE>
