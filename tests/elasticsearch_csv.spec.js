var ElasticsearchCSV = require('../lib/elasticsearch_csv');
var should = require('should');
var sinon = require('sinon');
var Promise = require('bluebird');

describe('ElasticsearchCSV', function() {

    describe('constructor', function () {

        it('should fail with error when no options are specified', function (done) {

            (function() {
                new ElasticsearchCSV();
            }).should.throw('index is invalid or missing');

            done();
        });

        it('should fail with error when invalid index is specified', function (done) {

            var options = { es: { index: null } };

            (function() {
                new ElasticsearchCSV(options);
            }).should.throw('index is invalid or missing');

            done();
        });

        it('should fail with error when invalid type is specified', function (done) {

            var options = { es: { index: 'my_index', type: null } };

            (function() {
                new ElasticsearchCSV(options);
            }).should.throw('type is invalid or missing');

            done();
        });

        it('should fail with error when invalid filePath is specified', function (done) {

            var options = { es: { index: 'my_index', type: 'my_type' }, csv: { filePath: null } };

            (function() {
                new ElasticsearchCSV(options);
            }).should.throw('filePath is invalid or missing');

            done();
        });

        it('should fail with error when filePath is specified is directory', function (done) {

            var options = { es: { index: 'my_index', type: 'my_type' }, csv: { filePath: '../' } };

            (function() {
                new ElasticsearchCSV(options);
            }).should.throw('file is a directory');

            done();
        });

        it('should fail with error when file is not found', function (done) {

            var options = { es: { index: 'my_index', type: 'my_type' }, csv: { filePath: '/foo/bar.txt' } };

            (function() {
                new ElasticsearchCSV(options);
            }).should.throw(/ENOENT[,|:] no such file or directory/);

            done();
        });

        it('should return instance when all options are valid', function (done){

            var options = { es: { index: 'my_index', type: 'my_type' }, csv: { filePath: 'fixtures/tsv_with_header.txt' } };

            var esCSV = new ElasticsearchCSV(options);

            esCSV.options.should.be.ok;

            done();
        });

    });

    describe('parse method', function () {

        describe('using a CSV file', function () {
            describe('with headers', function () {
                it('should fail with an error when headers option is not set', function (done){

                    var options = { es: { index: 'my_index', type: 'my_type' }, csv: { filePath: 'fixtures/csv_with_header.csv' } };

                    var esCSV = new ElasticsearchCSV(options);

                    var promise = esCSV.parse();

                    promise.should.be.a.Promise;
                    promise.should.be.rejectedWith('Data and/or options have no headers specified');

                    done();
                });

                it('should parse the file and create the request object', function (done){

                    var options = { es: { index: 'my_index', type: 'my_type' }, csv: { filePath: 'fixtures/csv_with_header.csv', headers: true } };

                    var esCSV = new ElasticsearchCSV(options);

                    var promise = esCSV.parse();

                    var i = 0;

                    promise.should.be.a.Promise;
                    promise.should.be.fulfilled;
                    promise.should.be.eventually.an.Object;
                    promise.should.eventually.have.property('body').and.be.an.Array;
                    promise.should.eventually.have.property('body').with.lengthOf(6);
                    promise.should.eventually.have.property('body').and.matchEach(function (it) {
                        if ((i % 2) === 0) {
                            it.should.be.an.Object;
                            it.should.have.property('index').and.be.an.Object;
                            it.index.should.have.keys([
                                '_id',
                                '_index',
                                '_type'
                            ]);
                            it.index._index.should.be.equal('my_index');
                            it.index._type.should.be.equal('my_type');
                        } else {
                            it.should.be.an.Object;
                            it.should.have.keys([
                                'id',
                                'first_name',
                                'last_name',
                                'email',
                                'country',
                                'height',
                                'weight'
                            ]);
                        }
                        i += 1;
                    });

                    done();
                });
            });

            describe('without headers', function () {
                it('should fail with an error when no headers were specified in options', function (done){

                    var options = { es: { index: 'my_index', type: 'my_type' }, csv: { filePath: 'fixtures/csv_no_header.csv' } };

                    var esCSV = new ElasticsearchCSV(options);

                    var promise = esCSV.parse();

                    promise.should.be.a.Promise;
                    promise.should.be.rejectedWith('Data and/or options have no headers specified');

                    done();
                });

                it('should parse the file and create the request object with specified headers in the options', function (done){

                    var options = { es: { index: 'my_index', type: 'my_type' }, csv: { filePath: 'fixtures/csv_no_header.csv', headers: [
                        'id',
                        'first_name',
                        'last_name',
                        'email',
                        'country',
                        'height',
                        'weight'
                    ] } };

                    var esCSV = new ElasticsearchCSV(options);

                    var promise = esCSV.parse();

                    var i = 0;

                    promise.should.be.a.Promise;
                    promise.should.be.fulfilled;
                    promise.should.eventually.be.an.Object;
                    promise.should.eventually.have.property('body').and.be.an.Array;
                    promise.should.eventually.have.property('body').with.lengthOf(6);
                    promise.should.eventually.have.property('body').and.matchEach(function (it) {
                        if ((i % 2) === 0) {
                            it.should.be.an.Object;
                            it.should.have.property('index').and.be.an.Object;
                            it.index.should.have.keys([
                                '_id',
                                '_index',
                                '_type'
                            ]);
                            it.index._index.should.be.equal('my_index');
                            it.index._type.should.be.equal('my_type');
                        } else {
                            it.should.be.an.Object;
                            it.should.have.keys([
                                'id',
                                'first_name',
                                'last_name',
                                'email',
                                'country',
                                'height',
                                'weight'
                            ]);
                        }
                        i += 1;
                    });

                    done();
                });
            });
            describe('with json', function () {
                it('should fail with an error when headers option is not set', function (done){

                    var options = { es: { index: 'my_index', type: 'my_type' }, csv: { filePath: 'fixtures/csv_with_json.csv' } };

                    var esCSV = new ElasticsearchCSV(options);

                    var promise = esCSV.parse();

                    promise.should.be.a.Promise;
                    promise.should.be.rejectedWith('Data and/or options have no headers specified');

                    done();
                });

                it('should parse the file and create the request object', function (done){

                    var options = { es: { index: 'my_index', type: 'my_type' }, csv: { filePath: 'fixtures/csv_with_json.csv', headers: true } };

                    var esCSV = new ElasticsearchCSV(options);

                    var promise = esCSV.parse();

                    var i = 0;

                    promise.should.be.a.Promise;
                    promise.should.be.fulfilled;
                    promise.should.be.eventually.an.Object;
                    promise.should.eventually.have.property('body').and.be.an.Array;
                    promise.should.eventually.have.property('body').with.lengthOf(6);
                    promise.should.eventually.have.property('body').and.matchEach(function (it) {
                        if ((i % 2) === 0) {
                            it.should.be.an.Object;
                            it.should.have.property('index').and.be.an.Object;
                            it.index.should.have.keys([
                                '_id',
                                '_index',
                                '_type'
                            ]);
                            it.index._index.should.be.equal('my_index');
                            it.index._type.should.be.equal('my_type');
                        } else {
                            it.should.be.an.Object;
                            it.should.have.keys([
                                'id',
                                'first_name',
                                'last_name',
                                'email',
                                'location'
                            ]);
                            it.location.should.be.an.Object;
                            it.location.should.have.keys([
                                'type',
                                'coordinates'
                            ]);
                        }
                        i += 1;
                    });

                    done();
                });
            });
        });

        describe('using a TSV file', function () {
            describe('with headers', function () {
                it('should fail with an error when headers option is not set', function (done){

                    var options = { es: { index: 'my_index', type: 'my_type' }, csv: { filePath: 'fixtures/tsv_with_header.txt', delimiter: '\t' } };

                    var esCSV = new ElasticsearchCSV(options);

                    var promise = esCSV.parse();

                    promise.should.be.a.Promise;
                    promise.should.be.rejectedWith('Data and/or options have no headers specified');

                    done();
                });
                it('should parse the file and create the request object', function (done){

                    var options = { es: { index: 'my_index', type: 'my_type' }, csv: { filePath: 'fixtures/tsv_with_header.txt', delimiter: '\t', headers: true } };

                    var esCSV = new ElasticsearchCSV(options);

                    var promise = esCSV.parse();

                    var i = 0;

                    promise.should.be.a.Promise;
                    promise.should.be.fulfilled;
                    promise.should.eventually.be.an.Object;
                    promise.should.eventually.have.property('body').and.be.an.Array;
                    promise.should.eventually.have.property('body').with.lengthOf(6);
                    promise.should.eventually.have.property('body').and.matchEach(function (it) {
                        if ((i % 2) === 0) {
                            it.should.be.an.Object;
                            it.should.have.property('index').and.be.an.Object;
                            it.index.should.have.keys([
                                '_id',
                                '_index',
                                '_type'
                            ]);
                            it.index._index.should.be.equal('my_index');
                            it.index._type.should.be.equal('my_type');
                        } else {
                            it.should.be.an.Object;
                            it.should.have.keys([
                                'id',
                                'first_name',
                                'last_name',
                                'email',
                                'country',
                                'height',
                                'weight'
                            ]);
                        }
                        i += 1;
                    });

                    done();
                });
            });

            describe('without headers', function () {
                it('should fail with an error when no headers were specified in options', function (done){

                    var options = { es: { index: 'my_index', type: 'my_type' }, csv: { filePath: 'fixtures/tsv_no_header.txt', delimiter: '\t' } };

                    var esCSV = new ElasticsearchCSV(options);

                    var promise = esCSV.parse();

                    promise.should.be.a.Promise;
                    promise.should.be.rejectedWith('Data and/or options have no headers specified');

                    done();
                });

                it('should parse the file and create the request object with specified headers in the options', function (done){

                    var options = { es: { index: 'my_index', type: 'my_type' }, csv: { filePath: 'fixtures/tsv_no_header.txt', delimiter: '\t', headers: [
                        'id',
                        'first_name',
                        'last_name',
                        'email',
                        'country',
                        'height',
                        'weight'
                    ] } };

                    var esCSV = new ElasticsearchCSV(options);

                    var promise = esCSV.parse();

                    var i = 0;

                    promise.should.be.a.Promise;
                    promise.should.be.fulfilled;
                    promise.should.eventually.be.an.Object;
                    promise.should.eventually.have.property('body').and.be.an.Array;
                    promise.should.eventually.have.property('body').with.lengthOf(6);
                    promise.should.eventually.have.property('body').and.matchEach(function (it) {

                        it.should.be.an.Object;

                        if ((i % 2) === 0) {
                            it.should.have.property('index').and.be.an.Object;
                            it.index.should.have.keys([
                                '_id',
                                '_index',
                                '_type'
                            ]);
                            it.index._index.should.be.equal('my_index');
                            it.index._type.should.be.equal('my_type');
                        } else {
                            it.should.have.keys([
                                'id',
                                'first_name',
                                'last_name',
                                'email',
                                'country',
                                'height',
                                'weight'
                            ]);
                        }
                        i += 1;
                    });

                    done();
                });
            });
        });

    });

    describe('import method', function () {

        it('should be return rejection when error occurs in parse method', function (done) {

            var options = { es: { index: 'my_index', type: 'my_type' }, csv: { filePath: 'fixtures/csv_with_header.csv', headers: true } };

            var esCSV = new ElasticsearchCSV(options);

            sinon.stub(esCSV, 'parse').returns(Promise.reject(new Error('my error')));

            var promise = esCSV.import();

            promise.should.be.a.Promise;
            promise.should.be.rejectedWith('my error');

            done();
        });
        it('should be return rejection when error occurs in Elasticsearch bulk request', function (done) {

            var options = { es: { index: 'my_index', type: 'my_type' }, csv: { filePath: 'fixtures/csv_with_header.csv', headers: true } };

            var esCSV = new ElasticsearchCSV(options);

            sinon.stub(esCSV.esClient, 'bulk').yields(new Error('my error'));

            var promise = esCSV.import();

            promise.should.be.a.Promise;
            promise.should.be.rejectedWith('my error');

            done();
        });
        it('should be return resolution and return a response from the Elasticsearch bulk request', function (done) {

            var options = { es: { index: 'my_index', type: 'my_type' }, csv: { filePath: 'fixtures/csv_with_header.csv', headers: true } };

            var esCSV = new ElasticsearchCSV(options);

            sinon.stub(esCSV.esClient, 'bulk').yields(null, 'returned response');

            var promise = esCSV.import();

            promise.should.be.a.Promise;
            promise.should.be.fulfilledWith('returned response');

            done();
        });

    });

});