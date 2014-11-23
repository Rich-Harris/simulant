var gobble = require( 'gobble' );

module.exports = gobble( 'src' )
	.transform( require( 'gobble-esperanto-bundle' ), {
		entry: 'simulant',
		type: 'umd',
		name: 'simulant'
	})
	.transform( '6to5' );