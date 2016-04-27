const keyboardParams = [ 'altKey', 'charCode', 'code', 'ctrlKey', 'isComposing', 'key', 'keyCode', 'keyIdentifier', 'location', 'metaKey', 'repeat', 'shiftKey', 'which' ];

export default function extendWithKeyboardParams ( event, params = {} ) {
	let i = keyboardParams.length;
	while ( i-- ) {
		event[ keyboardParams[i] ] = params[ keyboardParams[i] ];
	}
}
