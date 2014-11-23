var gobble = require( 'gobble' );

module.exports = gobble([
	gobble( 'root' ),

	gobble( '../src' )
		.transform( 'esperanto-bundle', {
			entry: 'simulant',
			dest: 'simulant.js',
			type: 'umd',
			name: 'simulant',
			sourceMap: true
		})
		.transform( '6to5' )
		.moveTo( 'build' )
]);