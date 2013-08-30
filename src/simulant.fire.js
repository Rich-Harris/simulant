if ( document.dispatchEvent ) {
	simulant.fire = function ( node, event, params ) {
		if ( typeof event === 'string' ) {
			event = simulant( event, params );
		}

		node.dispatchEvent( event );
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
	};
}

