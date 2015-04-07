import { defaults, eventGroupByType, initialisersByGroup, initialiserParams } from '../maps';
import extendWithKeyboardParams from '../utils/extendWithKeyboardParams';

export default function () {
	function makeInitialiser ( methodName, paramsList ) {
		return function ( event, type, params ) {
			event.type = type;

			let i = paramsList.length;
			while ( i-- ) {
				const paramName = paramsList[i];
				event[ paramName ] = params[ paramName ] || defaults[ paramName ];
			}
		};
	}

	let initialisers = {};
	let methodName;

	for ( methodName in initialiserParams ) {
		if ( initialiserParams.hasOwnProperty( methodName ) ) {
			initialisers[ methodName ] = makeInitialiser( methodName, initialiserParams[ methodName ] );
		}
	}

	initialisers.initEvent = makeInitialiser( 'initEvent', [] );

	function simulant ( type, params ) {
		let group = eventGroupByType[ type ];
		let isKeyboardEvent;

		if ( group === 'KeyboardEvent' ) {
			isKeyboardEvent = true;
			group = 'Event';
		}

		const initialiserName = initialisersByGroup[ group ][1];
		const initialise = initialisers[ initialiserName ];

		let event = document.createEventObject();
		initialise( event, type, params || {} );

		if ( isKeyboardEvent ) {
			extendWithKeyboardParams( event, params );
		}

		return event;
	}

	simulant.mode = 'ancient';
	return simulant;
}
