(function ( db , describe , it , runs , expect , waitsFor , beforeEach , afterEach ) {
    'use strict';
    describe('db.drop', function () {
        var dbName = 'tests',
            indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.oIndexedDB || window.msIndexedDB,
            server;
        
        beforeEach( function () {
            var done = false;

            runs( function () {
                done = false;
                db.open({
                    server: dbName,
                    version: 1,
                    schema: { 
                        test: {
                            key: {
                                keyPath: 'id',
                                autoIncrement: true
                            }
                        }
                    } 
                }).done(function ( s ) {
                    server = s;
                    done = true;
                });
            });

            waitsFor(function () {
                return done;
            }, "opening db", 1000);
            
        });

        it('should drop db', function () {
            var req, _dbName, done = false;

            runs(function () {
                server.drop().done(function (dn) {
                    _dbName = dn;
                    done = true;
                }).fail(function (e) {
                    console.log(e);
                });
            });

            waitsFor(function () {
                return done;
            }, "db dropped", 1000);

            runs(function () {
                expect(_dbName).toEqual(dbName);
                // db.close();
            });
        });
    });

})( window.db , window.describe , window.it , window.runs , window.expect , window.waitsFor , window.beforeEach , window.afterEach );
