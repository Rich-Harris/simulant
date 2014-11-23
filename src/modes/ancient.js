import { defaults, eventGroupByType, initialisersByGroup, initialiserParams } from '../maps';
import extendWithKeyboardParams from '../utils/extendWithKeyboardParams';

export default function () {
	var methodName, initialisers, makeInitialiser, simulant;

	initialisers = {};

	makeInitialiser = function ( methodName, paramsList ) {
		return function ( event, type, params ) {
			var paramName, i;

			event.type = type;

			i = paramsList.length;
			while ( i-- ) {
				paramName = paramsList[i];
				event[ paramName ] = params[ paramName ] || defaults[ paramName ];
			}
		};
	};

	for ( methodName in initialiserParams ) {
		if ( initialiserParams.hasOwnProperty( methodName ) ) {
			initialisers[ methodName ] = makeInitialiser( methodName, initialiserParams[ methodName ] );
		}
	}

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

		event = document.createEventObject();
		initialise( event, type, params || {} );

		if ( isKeyboardEvent ) {
			extendWithKeyboardParams( event, params );
		}

		return event;
	};

	simulant.mode = 'ancient';
	return simulant;
}
