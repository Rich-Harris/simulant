/*global window, describe, it, before, beforeEach, afterEach */
var isNode = typeof module !== 'undefined';

var path, fs, jsdom, assert;

if ( isNode ) {
	path = require( 'path' );
	fs = require( 'fs' );
	jsdom = require( 'jsdom' );
	assert = require( 'assert' );
} else {
	assert = window.chai.assert;
}

describe( 'simulant', function () {
	var simulantSrc, global, document, simulant, fixture;

	if ( isNode ) {
		before( function () {
			return require( '../gobblefile' ).build({
				dest: path.resolve( __dirname, '../.tmp' ),
				env: 'production',
				force: true
			}).then( function () {
				simulantSrc = fs.readFileSync( path.resolve( __dirname, '../.tmp/simulant.js' ), 'utf-8' );
			});
		});

		beforeEach( function () {
			return new Promise( function ( fulfil, reject ) {
				jsdom.env({
					html: '',
					src: [ simulantSrc ],
					done: function ( err, w ) {
						if ( err ) {
							reject( err );
						} else {
							global = w;
							document = global.document;
							simulant = global.simulant;

							global.fixture = fixture = document.createElement( 'div' );
							document.body.appendChild( fixture );

							global.console = console;
							fulfil( global );
						}
					}
				});
			});
		});

		afterEach( function () {
			global.close();
		});
	} else {
		global = window;
		document = window.document;
		simulant = window.simulant;

		beforeEach( function () {
			fixture = document.createElement( 'div' );
			container.appendChild( fixture );
		});

		afterEach( function () {
			container.removeChild( fixture );
		});
	}

	describe( 'simulant', function () {
		it( ' handles a basic click event', function () {
			var called = false;

			fixture.addEventListener( 'click', function () {
				called = true;
			});

			simulant.fire( fixture, 'click' );

			assert.ok( called );
		});

		it( 'uses MouseEvent for click events', function () {
			var receivedEvent;

			fixture.addEventListener( 'click', function ( event ) {
				receivedEvent = event;
			});

			var event = simulant.fire( fixture, 'click' );
			assert.ok( event instanceof global.MouseEvent );
			assert.ok( receivedEvent instanceof	global.MouseEvent );
		});

		// disabled pending https://github.com/tmpvar/jsdom/issues/1079
		/*it( 'toggles checkbox on click', function () {
			fixture.innerHTML = '<input type="checkbox">';
			var input = fixture.querySelector( 'input' );

			input.addEventListener( 'change', function () {
				console.log( 'change!' );
			});

			assert.equal( input.checked, false );
			simulant.fire( input, 'click' );
			assert.equal( input.checked, true );
		});*/

		// disabled pending https://github.com/tmpvar/jsdom/issues/1077
		it( 'creates events that bubble', function () {
			fixture.innerHTML = '<div id="outer"><div id="inner"></div></div>';

			var inner = document.getElementById( 'inner' );
			var outer = document.getElementById( 'outer' );
			var called, target;

			outer.addEventListener( 'click', function ( event ) {
				called = true;
				target = event.target;
			});

			simulant.fire( inner, 'click' );

			assert.ok( called );
			assert.strictEqual( target, inner );
		});

		it( 'passes the initially created event to handlers', function () {
			var event, receivedEvent;

			fixture.addEventListener( 'click', function ( e ) {
				receivedEvent = e;
			});

			event = simulant( 'click' );

			simulant.fire( fixture, event );
			assert.strictEqual( event, receivedEvent );
		});

		it( 'creates keyboard events with the expected attributes', function () {
			var which, ctrlKey;

			fixture.addEventListener( 'keydown',function ( event ) {
				which = event.which;
				ctrlKey = event.ctrlKey;
			});

			simulant.fire( fixture, 'keydown', {
				which: 70,
				ctrlKey: true
			});

			assert.equal( which, 70 );
			assert.ok( ctrlKey );
		});

		it( 'blurs an input', function () {
			var input, blurred;

			input = document.createElement( 'input' );

			input.addEventListener( 'blur', function () {
				blurred = true;
			});

			simulant.fire( input, 'blur' );
			assert.ok( blurred );
		});

		it( 'fires beforeunload (#6)', function () {
			simulant.fire( global, 'beforeunload' );
		});
	});
});