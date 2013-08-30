var eventGroupByType,
	initialisers,
	modern,
	ancient,
	modifiers,
	getModifiersList;



modifiers = [
	[ 'ctrlKey',  'Control' ],
	[ 'shiftKey', 'Shift'   ],
	[ 'altKey',   'Alt'     ],
	[ 'metaKey',  'Meta'    ]
];

getModifiersList = function ( params ) {
	var list = [], i, modifier;

	i = modifiers.length;
	while ( i-- ) {
		modifier = modifiers[i];
		if ( params[ modifier[0] ] ) {
			list[ list.length ] = modifier[1];
		}
	}

	return list.join( ' ' );
};


// unpack event groups
(function () {
	var group, types, i, initMethod;

	eventGroupByType = {};

	for ( group in eventTypesByGroup ) {
		if ( eventTypesByGroup.hasOwnProperty( group ) ) {
			types = eventTypesByGroup[ group ].split( ' ' );

			i = types.length;
			while ( i-- ) {
				eventGroupByType[ types[i] ] = group;
			}
		}
	}

	for ( initMethod in initialiserParams ) {
		if ( initialiserParams.hasOwnProperty( initMethod ) ) {
			initialiserParams[ initMethod ] = initialiserParams[ initMethod ].split( ' ' );
		}
	}
}());



try {
	// event initialisersByGroup
	new MouseEvent( 'click' );
	modern = true;
}

catch ( err ) {
	if ( !document.createEvent ) {
		if ( document.createEventObject ) {
			ancient = true;
		} else {
			throw new Error( 'Events cannot be created in this browser' );
		}
	}
}

if ( modern ) {
	useModern();
}

else if ( !ancient ) {
	useLegacy();
}

else {
	useAncient();
}


simulant.params = function ( type ) {
	var group;

	group = eventGroupByType[ type ];
	return initialiserParams[ initialisersByGroup[ group ][1] ].split( ' ' );
};

