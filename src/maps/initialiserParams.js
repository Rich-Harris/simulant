// The parameters required by event constructors and init methods, in the order the init methods need them.

// There is no initKeyboardEvent or initKeyEvent here. Keyboard events are a goddamned mess. You can't fake them
// well in any browser - the which and keyCode properties are readonly, for example. So we don't actually use the
// KeyboardEvent constructor, or the initKeyboardEvent or initKeyEvent methods. Instead we use a bog standard
// Event and add the required parameters as expando properties.

// TODO I think in some browsers we need to use modifiersList instead of ctrlKey/shiftKey etc?
var initialiserParams = {
	initUIEvent:          'view detail',
	initMouseEvent:       'view detail screenX screenY clientX clientY ctrlKey altKey shiftKey metaKey button relatedTarget',
	initCompositionEvent: 'view detail data locale',
	initHashChangeEvent:  'oldURL newURL',
	initMessageEvent:     'data origin lastEventId source ports',
	initStorageEvent:     'key oldValue newValue url storageArea',
	initWheelEvent:       'view detail screenX screenY clientX clientY ctrlKey altKey shiftKey metaKey button relatedTarget deltaX deltaY deltaZ deltaMode'
};