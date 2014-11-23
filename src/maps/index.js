export var defaults = {
	bubbles:       true,
	cancelable:    true,
	view:          window,
	detail:        null,
	screenX:       0,
	screenY:       0,
	clientX:       0,
	clientY:       0,
	ctrlKey:       false,
	altKey:        false,
	shiftKey:      false,
	metaKey:       false,
	button:        0,
	relatedTarget: null,
	locale:        '',
	oldURL:        '',
	newURL:        '',
	origin:        '',
	lastEventId:   '',
	source:        null,
	ports:         [],
	oldValue:      null,
	newValue:      null,
	url:           '',
	storageArea:   null,
	deltaX:        0,
	deltaY:        0,
	deltaZ:        0,
	deltaMode:     0
};


// TODO remove the ones that aren't supported in any browser
var eventTypesByGroup = {
	UIEvent:                     'abort error resize scroll select unload',
	Event:                       'afterprint beforeprint cached canplay canplaythrough change chargingchange chargingtimechange checking close dischargingtimechange DOMContentLoaded downloading durationchange emptied ended fullscreenchange fullscreenerror input invalid levelchange loadeddata loadedmetadata noupdate obsolete offline online open orientationchange pause pointerlockchange pointerlockerror play playing ratechange readystatechange reset seeked seeking stalled submit success suspend timeupdate updateready visibilitychange volumechange waiting',
	AnimationEvent:              'animationend animationiteration animationstart',
	AudioProcessingEvent:        'audioprocess',
	BeforeUnloadEvent:           'beforeunload',
	TimeEvent:                   'beginEvent endEvent repeatEvent',
	FocusEvent:                  'blur focus focusin focusout',
	MouseEvent:                  'click contextmenu dblclick mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup show',
	SensorEvent:                 'compassneedscalibration userproximity',
	OfflineAudioCompletionEvent: 'complete',
	CompositionEvent:            'compositionend compositionstart compositionupdate',
	ClipboardEvent:              'copy cut paste',
	DeviceLightEvent:            'devicelight',
	DeviceMotionEvent:           'devicemotion',
	DeviceOrientationEvent:      'deviceorientation',
	DeviceProximityEvent:        'deviceproximity',
	DragEvent:                   'drag dragend dragenter dragleave dragover dragstart drop',
	GamepadEvent:                'gamepadconnected gamepaddisconnected',
	HashChangeEvent:             'hashchange',
	KeyboardEvent:               'keydown keypress keyup',
	ProgressEvent:               'loadend loadstart progress timeout',
	MessageEvent:                'message',
	PageTransitionEvent:         'pagehide pageshow',
	PopStateEvent:               'popstate',
	StorageEvent:                'storage',
	SVGEvent:                    'SVGAbort SVGError SVGLoad SVGResize SVGScroll SVGUnload',
	SVGZoomEvent:                'SVGZoom',
	TouchEvent:                  'touchcancel touchend touchenter touchleave touchmove touchstart',
	TransitionEvent:             'transitionend',
	WheelEvent:                  'wheel'
};

export var eventGroupByType = {};

Object.keys( eventTypesByGroup ).forEach( group => {
	var types = eventTypesByGroup[ group ].split( ' ' );

	types.forEach( t => {
		eventGroupByType[t] = group;
	});
});


// The parameters required by event constructors and init methods, in the order the init methods need them.

// There is no initKeyboardEvent or initKeyEvent here. Keyboard events are a goddamned mess. You can't fake them
// well in any browser - the which and keyCode properties are readonly, for example. So we don't actually use the
// KeyboardEvent constructor, or the initKeyboardEvent or initKeyEvent methods. Instead we use a bog standard
// Event and add the required parameters as expando properties.

// TODO I think in some browsers we need to use modifiersList instead of ctrlKey/shiftKey etc?
export var initialiserParams = {
	initUIEvent:          'view detail',
	initMouseEvent:       'view detail screenX screenY clientX clientY ctrlKey altKey shiftKey metaKey button relatedTarget',
	initCompositionEvent: 'view detail data locale',
	initHashChangeEvent:  'oldURL newURL',
	initMessageEvent:     'data origin lastEventId source ports',
	initStorageEvent:     'key oldValue newValue url storageArea',
	initWheelEvent:       'view detail screenX screenY clientX clientY ctrlKey altKey shiftKey metaKey button relatedTarget deltaX deltaY deltaZ deltaMode'
};

Object.keys( initialiserParams ).forEach( initMethod => {
	initialiserParams[ initMethod ] = initialiserParams[ initMethod ].split( ' ' );
});


export var initialisersByGroup = {
	UIEvent:             [ window.UIEvent,             'initUIEvent'          ],
	Event:               [ window.Event,               'initEvent'            ],
	FocusEvent:          [ window.FocusEvent,          'initUIEvent'          ],
	MouseEvent:          [ window.MouseEvent,          'initMouseEvent'       ],
	CompositionEvent:    [ window.CompositionEvent,    'initCompositionEvent' ],
	HashChangeEvent:     [ window.HashChangeEvent,     'initHashChangeEvent'  ],
	KeyboardEvent:       [ window.Event,               'initEvent'            ],
	ProgressEvent:       [ window.ProgressEvent,       'initEvent'            ],
	MessageEvent:        [ window.MessageEvent,        'initMessageEvent'     ], // TODO prefixed?
	PageTransitionEvent: [ window.PageTransitionEvent, 'initEvent'            ],
	PopStateEvent:       [ window.PopStateEvent,       'initEvent'            ],
	StorageEvent:        [ window.StorageEvent,        'initStorageEvent'     ],
	TouchEvent:          [ window.TouchEvent,          'initTouchEvent'       ],
	WheelEvent:          [ window.WheelEvent,          'initWheelEvent'       ] // TODO this differs between browsers...
};

