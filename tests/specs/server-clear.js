(function ( db , describe , it , runs , expect , waitsFor , beforeEach , afterEach ) {
    'use strict';
    
    describe( 'server.clear' , function () {
        var dbName = 'tests',
            indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.oIndexedDB || window.msIndexedDB;
           
       beforeEach( function () {
            var done = false;
            var spec = this;
            
            spec.server = undefined;
            
            runs( function () {
                db.open( {
                    server: dbName ,
                    version: 1 ,
                    schema: { 
                        test: {
                            key: {
                                keyPath: 'id',
                                autoIncrement: true
                            }
                        }
                    }
                }).done(function ( s ) {
                    spec.server = s;
                });
            });
            
            waitsFor( function () { 
                return !!spec.server;
            } , 'wait on db' , 500 );

            runs(function () {
                done = false;

                var item1 = {
                    firstName: 'Aaron',
                    lastName: 'Powell'
                };

                var item2 = {
                    firstName: 'John',
                    lastName: 'Smith'
                };
                
                spec.server.add( 'test' , item1 , item2 ).done(function () {
                    done = true;
                });
            });

            waitsFor(function () {
                return done;
            }, 'add data', 1000);

        });
        
        afterEach( function () {
            var done;

            runs( function () {
                if ( this.server ) {
                    this.server.close();
                }                
                var req = indexedDB.deleteDatabase( dbName );
                
                req.onsuccess = function () {
                    done = true;
                };
                
                req.onerror = function () {
                    console.log( 'failed to delete db' , arguments );
                };
                
                req.onblocked = function () {
                    console.log( 'db blocked' , arguments );
                };
            });
            
            waitsFor( function () {
                 return done;
            }, 'timed out deleting the database', 1000);
        });
        
        it( 'should clear all items' , function () {
            
            var spec = this,
                done = false,
                len;
        
            runs( function () {
                spec.server.query('test').all().execute().done(function (rs) {
                    len = rs.length;
                    done = true;
                });
            });    

            waitsFor( function () {
                return done;
            }, 'timeout waiting for get items length', 1000);

            runs( function () {
                // expect
                expect(len).toBe(2);

                done = false;
                spec.server.clear('test').done(function () {
                    done = true;
                });
            });
            
            waitsFor( function () {
                return done;
            } , 'timeout waiting for clear items' , 1000 );

            runs( function () {
                done = false;
                spec.server.query('test').all().execute().done(function ( rs ) {
                    done = true;
                    len = rs.length;
                });
            });

            waitsFor( function () {
                return done;
            } , 'timed out running expects', 1000 );

            runs( function () {
                expect(len).toBe(0);
            });
        });
    });

})( window.db , window.describe , window.it , window.runs , window.expect , window.waitsFor , window.beforeEach , window.afterEach );
