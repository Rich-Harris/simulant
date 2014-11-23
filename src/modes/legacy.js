import { defaults, eventGroupByType, initialisersByGroup, initialiserParams } from '../maps';
import extendWithKeyboardParams from '../utils/extendWithKeyboardParams';

export default function () {
	var methodName, initialisers, makeInitialiser, simulant;

	initialisers = {};

	makeInitialiser = function ( methodName, paramsList ) {
		return function ( event, type, params ) {
			var args;

			// first three args are always `type`, `bubbles`, `cancelable`
			args = [ type, true, true ]; // TODO some events don't bubble?

			paramsList.forEach( paramName => {
				args.push( params[ paramName ] || defaults[ paramName ] );
			});

			event[ methodName ].apply( event, args );
		};
	};

	Object.keys( initialiserParams ).forEach( methodName => {
		initialisers[ methodName ] = makeInitialiser( methodName, initialiserParams[ methodName ] );
	});

	initialisers.initEvent = makeInitialiser( 'initEvent', [] );

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
	return simulant;
}
