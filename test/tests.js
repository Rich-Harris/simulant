(function () {

	'use strict';

	var fixture = document.getElementById( 'qunit-fixture' );

	if ( !window.addEventListener && simulant.polyfill ) {
		simulant.polyfill();
	}

	console.log( 'Simulant is running in "' + simulant.mode + '" mode' );

	test( 'Basic click event', function ( t ) {
		var handler;

		expect( 1 );

		fixture.addEventListener( 'click', handler = function ( event ) {
			t.ok( true );
		});

		simulant.fire( fixture, 'click' );
		
		fixture.removeEventListener( 'click', handler );
	});

	if ( typeof MouseEvent !== 'undefined' ) {
		test( 'Click event is an instance of MouseEvent', function ( t ) {
			var event;

			expect( 1 );

			event = simulant( 'click' );
			t.ok( event instanceof MouseEvent );
		});

		test( 'Click event received by handler is an instance of MouseEvent', function ( t ) {
			var handler;

			expect( 1 );

			fixture.addEventListener( 'click', handler = function ( event ) {
				t.ok( event instanceof MouseEvent );
			});

			simulant.fire( fixture, 'click' );

			fixture.removeEventListener( 'click', handler );
		});
	}

	test( 'Click event toggles checkbox', function ( t ) {
		var input;

		expect( 2 );

		fixture.innerHTML = '<input type="checkbox">';
		input = fixture.querySelector( 'input' );

		input.addEventListener( 'change', function ( event ) {
			console.log( 'change!' );
		});

		t.equal( input.checked, false );
		simulant.fire( input, 'click' );
		t.equal( input.checked, true );

		fixture.innerHTML = '';
	});

	test( 'Events bubble', function ( t ) {
		var handler, inner, outer;

		expect( 2 );

		fixture.innerHTML = '<div id="outer"><div id="inner"></div></div>';

		inner = document.getElementById( 'inner' );
		outer = document.getElementById( 'outer' );

		outer.addEventListener( 'click', handler = function ( event ) {
			t.ok( true );
			t.equal( event.target, inner );
		});

		simulant.fire( inner, 'click' );

		outer.removeEventListener( 'click', handler );
		fixture.innerHTML = '';
	});

	if ( !addEventListener.simulant ) {
		test( 'The event passed to the handler is identical to the initially created event', function ( t ) {
			var event, handler;

			expect( 1 );

			fixture.addEventListener( 'click', handler = function ( receivedEvent ) {
				t.equal( receivedEvent, event );
			});

			event = simulant( 'click' );

			simulant.fire( fixture, event );

			fixture.removeEventListener( 'click', handler );
		});
	}

	test( 'Keyboard events have the expected attributes', function ( t ) {
		var handler;

		expect( 1 );

		fixture.addEventListener( 'keydown', handler = function ( event ) {
			t.equal( event.which, 70 );
		});

		simulant.fire( fixture, 'keydown', {
			which: 70,
			ctrlKey: true
		});

		fixture.removeEventListener( 'keydown', handler );
	});

}());