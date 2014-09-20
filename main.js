/* jshint node: true */
'use strict';


/** Deps */
var
fs = require('fs'),
HebrewRange = require('./hebrew-range');


var removeValuesSpaces = function( obj ) {
    var newObj = {};

    for ( var key in obj ) {
        if ( obj.hasOwnProperty( key ) ) {
            newObj[ key ] = obj[ key ].replace( /\s/g, '' );
        }
    }

    return newObj;
};

/** Used for testing if there are two identical values */
var testDuplications = function( range ) {
    var
    duplications = {},
    values = {};

    Object
        .keys( range )
        .forEach(function( keyName ) {
            var value = range[ keyName ];

            /** Assign a duplication if any */
            if ( value in values ) {
                duplications[ value ] = true;
            }

            /** Assign value to values */
            values[ value ] = true;
        });

    /** @debug */
    console.log( 'Are length of key identical? ' +
        (Object.keys(range).length ===  Object.keys(values).length) );

    if ( Object.keys( duplications ).length > 0 ) {
        return duplications;
    }

    return null;
};

/** Used for creating JSON file of range */
var createJSON = function( range, filename, callback ) {
    if ( ! ( typeof filename === 'string' && filename.length > 0 ) ) {
        throw new TypeError();
    }

    var fullPathFileName = __dirname + '/' + filename + '.json';

    fs.writeFile( fullPathFileName, JSON.stringify(range), callback );
};


/** Initialize */
(function() {
    var
    /** @type {Number} Counter to inform completion of async tasks */
    toComplete = 2,
    /** @type {Object} */
    HebrewRangeSpaceless = removeValuesSpaces( HebrewRange ),
    /** @type {Object} */
    duplications = testDuplications( HebrewRange ),
    /** @type {Object} */
    duplicationsSpaceless = testDuplications( HebrewRangeSpaceless );

    if (duplications !== null) {
        console.error( 'duplications: ' +
            Object.keys( duplications ).join(', ') );
    }

    if (duplicationsSpaceless !== null) {
        console.error( 'duplications in spaceless: ' +
            Object.keys( duplicationsSpaceless ).join(', ') );
    }

    createJSON( HebrewRange, 'hebrew-range.min', function(error) {
        if (error) console.error(error);

        if ( --toComplete === 0 ) console.log( 'complete.' );
    });

    createJSON( HebrewRangeSpaceless, 'hebrew-range-spaceless.min', function(error) {
        if (error) console.error(error);

        if ( --toComplete === 0 ) console.log( 'complete.' );
    });
} ());
