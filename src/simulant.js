import ancient from './modes/ancient';
import legacy from './modes/legacy';
import modern from './modes/modern';
import polyfill from './utils/polyfill';

var simulant;

try {
	new MouseEvent( 'click' );
	simulant = modern();
} catch ( err ) {
	if ( !document.createEvent ) {
		if ( document.createEventObject ) {
			simulant = ancient();
		} else {
			throw new Error( 'Events cannot be created in this browser' );
		}
	} else {
		simulant = legacy();
	}
}

if ( document.dispatchEvent ) {
	simulant.fire = function ( node, event, params ) {
		if ( typeof event === 'string' ) {
			event = simulant( event, params );
		}

		node.dispatchEvent( event );
		return event;
	};
} else if ( document.fireEvent ) {
	simulant.fire = function ( node, event, params ) {
		if ( typeof event === 'string' ) {
			event = simulant( event, params );
		}

		node.fireEvent( 'on' + event.type, event );

		// Special case - checkbox inputs
		if ( node.tagName === 'INPUT' && node.type === 'checkbox' ) {
			node.click();
		}
		return event;
	};
}

simulant.polyfill = polyfill;

export default simulant;
