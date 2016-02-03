/*global require, __dirname */
var path = require( 'path' );
var chalk = require( 'chalk' );
var Nightmare = require( 'nightmare' );

var nightmare = Nightmare({ show: false });

var tests = [];
var test;

var errored;

nightmare.on( 'console', function ( method, message, data ) {
	var args = [].slice.call( arguments, 2 );

	switch ( message ) {
	case 'start':
		test = {
			title: args[0],
			errored: false
		};
		tests.push( test );

		break;

	case 'error':
		test.errored = true;
		test.errorMessage = args[0];
		break;

	case 'end':
		if ( test.errored ) {
			console.log( chalk.red( '✗ ' + test.title ) );
			console.log( chalk.red( '--> ' + test.errorMessage ) );
			errored = true;
		} else {
			console.log( chalk.green( '✓ ' + test.title ) );
		}
		break;
	}
});

console.log( 'running tests...' );

var timeout = setTimeout( () => {
	console.log( 'timed out!' );
	process.exit( 1 );
}, 10000 );

nightmare
	.goto( 'file://' + path.resolve( __dirname, 'index.html' ) )
	.run( () => {
		console.log( '...tests completed' );
		process.exit( errored ? 1 : 0 );
	});
