var useLegacy = function () {
	// create initialisers
	(function () {
		var methodName, makeInitialiser;

		initialisers = {};

		makeInitialiser = function ( methodName, paramsList ) {
			return function ( event, type, params ) {
				var args, paramName, i, len;

				// first two args are always bubbles, cancelable
				args = [ true, true ]; // TODO some events don't bubble?

				len = paramsList.length;
				for ( i=0; i<len; i+=1 ) {
					paramName = paramsList[i];
					args[ args.length ] = params[ paramName ] || defaults[ paramName ];
				}

				args.unshift( type );

				event[ methodName ].apply( event, args );
			};
		};

		for ( methodName in initialiserParams ) {
			if ( initialiserParams.hasOwnProperty( methodName ) ) {
				initialisers[ methodName ] = makeInitialiser( methodName, initialiserParams[ methodName ] );
			}
		}

		initialisers.initEvent = makeInitialiser( 'initEvent', [] );
	}());

	simulant = function ( type, params ) {
		var event, group, initialiserName, initialise, isKeyboardEvent;

		group = eventGroupByType[ type ];

		if ( group === 'KeyboardEvent' ) {
			isKeyboardEvent = true;
			group = 'Event';
		}
		
		initialiserName = initialisersByGroup[ group ][1];
		initialise = initialisers[ initialiserName ];

		event = document.createEvent( group );
		initialise( event, type, params || {} );

		if ( isKeyboardEvent ) {
			extendWithKeyboardParams( event, params );
		}

		return event;
	};

	simulant.mode = 'legacy';
};

