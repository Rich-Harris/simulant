import { defaults, eventGroupByType, initialisersByGroup, initialiserParams } from '../maps';
import extendWithKeyboardParams from '../utils/extendWithKeyboardParams';

export default function () {
	var simulant = function ( type, params = {} ) {
		var event, group, Constructor, paramsList, paramName, i, extendedParams, isKeyboardEvent;

		group = eventGroupByType[ type ];

		if ( group === 'KeyboardEvent' ) {
			group = 'Event'; // because you can't fake KeyboardEvents well in any browser
			isKeyboardEvent = true;
		}

		Constructor = initialisersByGroup[ group ][0];

		extendedParams = {
			bubbles: true, // TODO some events don't bubble?
			cancelable: true
		};

		paramsList = initialiserParams[ initialisersByGroup[ group ][1] ];
		i = ( paramsList ? paramsList.length : 0 );

		while ( i-- ) {
			paramName = paramsList[i];
			extendedParams[ paramName ] = ( paramName in params ? params[ paramName ] : defaults[ paramName ] );
		}

		event = new Constructor( type, extendedParams );

		if ( isKeyboardEvent ) {
			extendWithKeyboardParams( event, params );
		}

		return event;
	};

	simulant.mode = 'modern';
	return simulant;
}
