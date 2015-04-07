var gobble = require( 'gobble' );

var lib = gobble( 'src' )
	.transform( 'babel', {
		blacklist: [ 'es6.modules', 'useStrict' ],
		sourceMap: true
	})
	.transform( require( 'gobble-esperanto-bundle' ), {
		entry: 'simulant',
		type: 'umd',
		name: 'simulant',
		sourceMap: true
	})
	.transform( 'sorcery' );

var test = gobble([
	'test'
]);


if ( gobble.env() === 'production' ) {
	module.exports = lib;
} else {
	module.exports = gobble([ lib, test ]);
}