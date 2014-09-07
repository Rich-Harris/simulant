var initialisersByGroup = {
	UIEvent:             [ global.UIEvent,             'initUIEvent'          ],
	Event:               [ global.Event,               'initEvent'            ],
	FocusEvent:          [ global.FocusEvent,          'initUIEvent'          ],
	MouseEvent:          [ global.MouseEvent,          'initMouseEvent'       ],
	CompositionEvent:    [ global.CompositionEvent,    'initCompositionEvent' ],
	HashChangeEvent:     [ global.HashChangeEvent,     'initHashChangeEvent'  ],
	KeyboardEvent:       [ global.Event,               'initEvent'            ],
	ProgressEvent:       [ global.ProgressEvent,       'initEvent'            ],
	MessageEvent:        [ global.MessageEvent,        'initMessageEvent'     ], // TODO prefixed?
	PageTransitionEvent: [ global.PageTransitionEvent, 'initEvent'            ],
	PopStateEvent:       [ global.PopStateEvent,       'initEvent'            ],
	StorageEvent:        [ global.StorageEvent,        'initStorageEvent'     ],
	WheelEvent:          [ global.WheelEvent,          'initWheelEvent'       ] // TODO this differs between browsers...
};

