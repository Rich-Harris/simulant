/*global it, expect, assert, el, simulant, console */
it( 'handles a basic click event', function () {
	expect( 1 );

	var called = false;

	el.addEventListener( 'click', function () {
		called = true;
	});

	simulant.fire( el, 'click' );

	assert.ok( called );
});

it( 'uses MouseEvent for click events', function () {
	expect( 2 );

	var receivedEvent;

	el.addEventListener( 'click', function ( event ) {
		receivedEvent = event;
	});

	var event = simulant.fire( el, 'click' );
	assert.ok( event instanceof window.MouseEvent );
	assert.ok( receivedEvent instanceof	window.MouseEvent );
});

it( 'toggles checkbox on click', function () {
	expect( 3 );

	el.innerHTML = '<input type="checkbox">';
	var input = el.querySelector( 'input' );

	var changeHandlerCalled = false;

	input.addEventListener( 'change', function () {
		changeHandlerCalled = true;
	});

	assert.equal( input.checked, false );
	simulant.fire( input, 'click' );
	assert.equal( input.checked, true );
	assert.ok( changeHandlerCalled );
});

it( 'creates events that bubble', function () {
	expect( 2 );

	el.innerHTML = '<div id="outer"><div id="inner"></div></div>';

	var inner = document.getElementById( 'inner' );
	var outer = document.getElementById( 'outer' );
	var called, target;

	outer.addEventListener( 'click', function ( event ) {
		called = true;
		target = event.target;
	});

	simulant.fire( inner, 'click' );

	assert.ok( called );
	assert.equal( target, inner );
});

it( 'passes the initially created event to handlers', function () {
	expect( 1 );

	var event, receivedEvent;

	el.addEventListener( 'click', function ( e ) {
		receivedEvent = e;
	});

	event = simulant( 'click' );

	simulant.fire( el, event );
	assert.equal( event, receivedEvent );
});

it( 'creates keyboard events with the expected attributes', function () {
	expect( 2 );

	var which, ctrlKey;

	el.addEventListener( 'keydown',function ( event ) {
		which = event.which;
		ctrlKey = event.ctrlKey;
	});

	simulant.fire( el, 'keydown', {
		which: 70,
		ctrlKey: true
	});

	assert.equal( which, 70 );
	assert.ok( ctrlKey );
});

it( 'blurs an input', function () {
	expect( 1 );

	var input, blurred;

	input = document.createElement( 'input' );

	input.addEventListener( 'blur', function () {
		blurred = true;
	});

	simulant.fire( input, 'blur' );
	assert.ok( blurred );
});

it( 'fires beforeunload (#6)', function () {
	expect( 1 );

	function handler () {
		called = true;
	}

	window.addEventListener( 'beforeunload', handler );

	simulant.fire( window, 'beforeunload' );
	assert.ok( called );

	window.removeEventListener( 'beforeunload', handler );
});
