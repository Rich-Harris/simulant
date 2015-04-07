import { defaults, eventGroupByType, initialisersByGroup, initialiserParams } from '../maps';
import extendWithKeyboardParams from '../utils/extendWithKeyboardParams';

export default function () {
	function simulant ( type, params = {} ) {
		let group = eventGroupByType[ type ];
		let isKeyboardEvent;

		if ( group === 'KeyboardEvent' ) {
			group = 'Event'; // because you can't fake KeyboardEvents well in any browser
			isKeyboardEvent = true;
		}

		const initialiser = ( initialisersByGroup[ group ] || initialisersByGroup.Event );

		const Constructor = initialiser[0] || window.Event;
		const method = initialiser[1];

		let extendedParams = {
			bubbles: true, // TODO some events don't bubble?
			cancelable: true
		};

		const paramsList = initialiserParams[ method ];
		let i = ( paramsList ? paramsList.length : 0 );

		while ( i-- ) {
			const paramName = paramsList[i];
			extendedParams[ paramName ] = ( paramName in params ? params[ paramName ] : defaults[ paramName ] );
		}

		let event = new Constructor( type, extendedParams );

		if ( isKeyboardEvent ) {
			extendWithKeyboardParams( event, params );
		}

		return event;
	}

	simulant.mode = 'modern';
	return simulant;
}
