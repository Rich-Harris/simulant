var keyboardParams = [ 'which', 'keyCode', 'shiftKey', 'ctrlKey', 'altKey', 'metaKey' ];

var extendWithKeyboardParams = function ( event, params ) {
	var i = keyboardParams.length;
	while ( i-- ) {
		event[ keyboardParams[i] ] = params[ keyboardParams[i] ];
	}
};

