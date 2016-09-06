/* load required js files */
var Handlebars 		= 	require( './handlebars-v2.0.0' );
var extend 			= 	require( 'extend' );
var FileSystem		= 	require( 'fs' );
var Path 			=	require( 'path' ) ;
var Colors			=	require( 'colors' );

/* pass console arguments */
var globalData		=	'';
var templateData	=	'';
var contentData 	=	'';
var outputData		=	'';
var helpersData		=	'';

var argvExt			=	Path.extname( process.argv[ 2 ] );
var basename		=	Path.basename( process.argv[ 2 ], argvExt );
var basePath		=	Path.dirname( process.argv[ 2 ] ) + '/' + basename;

/* load helper functions  */
FileSystem.readFile( basePath + '.js' , 'utf8', function( err, data ) {
  	if ( err ) {
  		console.log( ( '[WAR] Couldn\'t find ' + basename + '.js' ).yellow );
  	} else {
  		eval( data );
  	}
} ) ;

FileSystem.readFile( basePath + '.handlebars', 'utf8', function( err, data ) {
  	if ( err ) {
  		console.log( ( '[ERR] Couldn\'t find ' + basename + '.handlebars' ).red );

  		process.exit();
  	}

  	templateData = data;
} ) ;

FileSystem.readFile( Path.dirname( process.argv[ 2 ] ) + '/global.json', 'utf8', function( err, data ) {
  	if ( err ) {
  		console.log( ( '[WAR] Couldn\'t find global.json' ).yellow );
	} else {
  		globalData = JSON.parse( data );
	}
} ) ;

FileSystem.readFile( basePath + '.json', 'utf8', function( err, data ) {
  	if ( err ) {
  		console.log( ( '[ERR] Couldn\'t find ' + basename + '.json' ).red );

  		process.exit();
  	}

  	contentData = JSON.parse( data );
} );

var interval = setInterval( function() {
	if ( contentData != '' && templateData != '' ) {
		if ( globalData != '' ) {
			extend( false, contentData, globalData );
		}

		outputData = ( Handlebars.compile( templateData ) ) ( contentData );

		FileSystem.writeFile( basePath + '.html', outputData, function( err ) {
		    if( err ) {
		        throw err;
		    } else {
		        console.log( 'Template generated to ' + basePath + '.html' );
		    }
		} );

		clearInterval( interval );
	}
}, 100 );
