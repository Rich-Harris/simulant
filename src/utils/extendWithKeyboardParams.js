const keyboardParams = [ 'which', 'keyCode', 'shiftKey', 'ctrlKey', 'altKey', 'metaKey' ];

export default function extendWithKeyboardParams ( event, params ) {
	let i = keyboardParams.length;
	while ( i-- ) {
		event[ keyboardParams[i] ] = params[ keyboardParams[i] ];
	}
}
