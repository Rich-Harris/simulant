var useModern = function () {
	simulant = function ( type, params ) {
		var event, group, Constructor, paramsList, paramName, i, extendedParams, isKeyboardEvent;

		group = eventGroupByType[ type ];

		if ( group === 'KeyboardEvent' ) {
			group = 'Event'; // because you can't fake KeyboardEvents well in any browser
			isKeyboardEvent = true;
		}

		Constructor = initialisersByGroup[ group ][0];

		if ( !params ) {
			params = {};
		}

		extendedParams = {
			bubbles: true, // TODO some events don't bubble?
			cancelable: true
		};

		paramsList = initialiserParams[ initialisersByGroup[ group ][1] ];
		i = ( paramsList ? paramsList.length : 0 );

		while ( i-- ) {
			paramName = paramsList[i];
			extendedParams[ paramName ] = ( params[ paramName ] !== undefined ? params[ paramName ] : defaults[ paramName ] );
		}

		event = new Constructor( type, extendedParams );

		if ( isKeyboardEvent ) {
			extendWithKeyboardParams( event, params );
		}

		return event;
	};

	simulant.mode = 'modern';
};

