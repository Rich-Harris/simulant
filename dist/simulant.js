(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	global.simulant = factory()
}(this, function () { 'use strict';

	var defaults = {
		bubbles: true,
		cancelable: true,
		view: window,
		detail: null,
		screenX: 0,
		screenY: 0,
		clientX: 0,
		clientY: 0,
		ctrlKey: false,
		altKey: false,
		shiftKey: false,
		metaKey: false,
		button: 0,
		relatedTarget: null,
		locale: '',
		oldURL: '',
		newURL: '',
		origin: '',
		lastEventId: '',
		source: null,
		ports: [],
		oldValue: null,
		newValue: null,
		url: '',
		storageArea: null,
		deltaX: 0,
		deltaY: 0,
		deltaZ: 0,
		deltaMode: 0
	};

	var eventTypesByGroup = {
		UIEvent: 'abort error resize scroll select unload',
		Event: 'afterprint beforeprint cached canplay canplaythrough change chargingchange chargingtimechange checking close dischargingtimechange DOMContentLoaded downloading durationchange emptied ended fullscreenchange fullscreenerror input invalid levelchange loadeddata loadedmetadata noupdate obsolete offline online open orientationchange pause pointerlockchange pointerlockerror play playing ratechange readystatechange reset seeked seeking stalled submit success suspend timeupdate updateready visibilitychange volumechange waiting',
		AnimationEvent: 'animationend animationiteration animationstart',
		AudioProcessingEvent: 'audioprocess',
		BeforeUnloadEvent: 'beforeunload',
		TimeEvent: 'beginEvent endEvent repeatEvent',
		FocusEvent: 'blur focus focusin focusout',
		MouseEvent: 'click contextmenu dblclick mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup show',
		SensorEvent: 'compassneedscalibration userproximity',
		OfflineAudioCompletionEvent: 'complete',
		CompositionEvent: 'compositionend compositionstart compositionupdate',
		ClipboardEvent: 'copy cut paste',
		DeviceLightEvent: 'devicelight',
		DeviceMotionEvent: 'devicemotion',
		DeviceOrientationEvent: 'deviceorientation',
		DeviceProximityEvent: 'deviceproximity',
		DragEvent: 'drag dragend dragenter dragleave dragover dragstart drop',
		GamepadEvent: 'gamepadconnected gamepaddisconnected',
		HashChangeEvent: 'hashchange',
		KeyboardEvent: 'keydown keypress keyup',
		ProgressEvent: 'loadend loadstart progress timeout',
		MessageEvent: 'message',
		PageTransitionEvent: 'pagehide pageshow',
		PopStateEvent: 'popstate',
		StorageEvent: 'storage',
		SVGEvent: 'SVGAbort SVGError SVGLoad SVGResize SVGScroll SVGUnload',
		SVGZoomEvent: 'SVGZoom',
		TouchEvent: 'touchcancel touchend touchenter touchleave touchmove touchstart',
		TransitionEvent: 'transitionend',
		WheelEvent: 'wheel'
	};

	var eventGroupByType = {};

	Object.keys(eventTypesByGroup).forEach(function (group) {
		var types = eventTypesByGroup[group].split(' ');

		types.forEach(function (t) {
			eventGroupByType[t] = group;
		});
	});

	// The parameters required by event constructors and init methods, in the order the init methods need them.

	// There is no initKeyboardEvent or initKeyEvent here. Keyboard events are a goddamned mess. You can't fake them
	// well in any browser - the which and keyCode properties are readonly, for example. So we don't actually use the
	// KeyboardEvent constructor, or the initKeyboardEvent or initKeyEvent methods. Instead we use a bog standard
	// Event and add the required parameters as expando properties.

	// TODO I think in some browsers we need to use modifiersList instead of ctrlKey/shiftKey etc?
	var initialiserParams = {
		initUIEvent: 'view detail',
		initMouseEvent: 'view detail screenX screenY clientX clientY ctrlKey altKey shiftKey metaKey button relatedTarget',
		initCompositionEvent: 'view detail data locale',
		initHashChangeEvent: 'oldURL newURL',
		initMessageEvent: 'data origin lastEventId source ports',
		initStorageEvent: 'key oldValue newValue url storageArea',
		initWheelEvent: 'view detail screenX screenY clientX clientY ctrlKey altKey shiftKey metaKey button relatedTarget deltaX deltaY deltaZ deltaMode'
	};

	Object.keys(initialiserParams).forEach(function (initMethod) {
		initialiserParams[initMethod] = initialiserParams[initMethod].split(' ');
	});

	var initialisersByGroup = {
		UIEvent: [window.UIEvent, 'initUIEvent'],
		Event: [window.Event, 'initEvent'],
		FocusEvent: [window.FocusEvent, 'initUIEvent'],
		MouseEvent: [window.MouseEvent, 'initMouseEvent'],
		CompositionEvent: [window.CompositionEvent, 'initCompositionEvent'],
		HashChangeEvent: [window.HashChangeEvent, 'initHashChangeEvent'],
		KeyboardEvent: [window.Event, 'initEvent'],
		ProgressEvent: [window.ProgressEvent, 'initEvent'],
		MessageEvent: [window.MessageEvent, 'initMessageEvent'], // TODO prefixed?
		PageTransitionEvent: [window.PageTransitionEvent, 'initEvent'],
		PopStateEvent: [window.PopStateEvent, 'initEvent'],
		StorageEvent: [window.StorageEvent, 'initStorageEvent'],
		TouchEvent: [window.TouchEvent, 'initTouchEvent'],
		WheelEvent: [window.WheelEvent, 'initWheelEvent'] // TODO this differs between browsers...
	};

	var utils_extendWithKeyboardParams = extendWithKeyboardParams;
	var keyboardParams = ['which', 'keyCode', 'shiftKey', 'ctrlKey', 'altKey', 'metaKey'];
	function extendWithKeyboardParams(event, params) {
		var i = keyboardParams.length;
		while (i--) {
			event[keyboardParams[i]] = params[keyboardParams[i]];
		}
	}

	var ancient = function () {
		function makeInitialiser(methodName, paramsList) {
			return function (event, type, params) {
				event.type = type;

				var i = paramsList.length;
				while (i--) {
					var paramName = paramsList[i];
					event[paramName] = params[paramName] || defaults[paramName];
				}
			};
		}

		var initialisers = {};
		var methodName = undefined;

		for (methodName in initialiserParams) {
			if (initialiserParams.hasOwnProperty(methodName)) {
				initialisers[methodName] = makeInitialiser(methodName, initialiserParams[methodName]);
			}
		}

		initialisers.initEvent = makeInitialiser('initEvent', []);

		function simulant(type, params) {
			var group = eventGroupByType[type];
			var isKeyboardEvent = undefined;

			if (group === 'KeyboardEvent') {
				isKeyboardEvent = true;
				group = 'Event';
			}

			var initialiserName = initialisersByGroup[group][1];
			var initialise = initialisers[initialiserName];

			var event = document.createEventObject();
			initialise(event, type, params || {});

			if (isKeyboardEvent) {
				utils_extendWithKeyboardParams(event, params);
			}

			return event;
		}

		simulant.mode = 'ancient';
		return simulant;
	}

	var legacy = function () {
		function makeInitialiser(methodName, paramsList) {
			return function (event, type, params) {
				var args;

				// first three args are always `type`, `bubbles`, `cancelable`
				args = [type, true, true]; // TODO some events don't bubble?

				paramsList.forEach(function (paramName) {
					args.push(params[paramName] || defaults[paramName]);
				});

				event[methodName].apply(event, args);
			};
		}

		var initialisers = {};

		Object.keys(initialiserParams).forEach(function (methodName) {
			initialisers[methodName] = makeInitialiser(methodName, initialiserParams[methodName]);
		});

		initialisers.initEvent = makeInitialiser('initEvent', []);

		function simulant(type, params) {
			var event, group, initialiserName, initialise, isKeyboardEvent;

			group = eventGroupByType[type];

			if (group === 'KeyboardEvent') {
				isKeyboardEvent = true;
				group = 'Event';
			}

			initialiserName = initialisersByGroup[group][1];
			initialise = initialisers[initialiserName];

			event = document.createEvent(group);
			initialise(event, type, params || {});

			if (isKeyboardEvent) {
				utils_extendWithKeyboardParams(event, params);
			}

			return event;
		}

		simulant.mode = 'legacy';
		return simulant;
	}

	var modern = function () {
		function simulant(type) {
			var params = arguments[1] === undefined ? {} : arguments[1];

			var group = eventGroupByType[type];
			var isKeyboardEvent = undefined;

			if (group === 'KeyboardEvent') {
				group = 'Event'; // because you can't fake KeyboardEvents well in any browser
				isKeyboardEvent = true;
			}

			var initialiser = initialisersByGroup[group] || initialisersByGroup.Event;

			var Constructor = initialiser[0] || window.Event;
			var method = initialiser[1];

			var extendedParams = {
				bubbles: true, // TODO some events don't bubble?
				cancelable: true
			};

			var paramsList = initialiserParams[method];
			var i = paramsList ? paramsList.length : 0;

			while (i--) {
				var paramName = paramsList[i];
				extendedParams[paramName] = paramName in params ? params[paramName] : defaults[paramName];
			}

			var event = new Constructor(type, extendedParams);

			if (isKeyboardEvent) {
				utils_extendWithKeyboardParams(event, params);
			}

			return event;
		}

		simulant.mode = 'modern';
		return simulant;
	}

	var utils_polyfill = polyfill;

	function polyfill() {

		// https://gist.github.com/Rich-Harris/6010282 via https://gist.github.com/jonathantneal/2869388
		// addEventListener polyfill IE6+
		var Event, addEventListener, removeEventListener, head, style;

		Event = function (e, element) {
			var property,
			    instance = this;

			for (property in e) {
				instance[property] = e[property];
			}

			instance.currentTarget = element;
			instance.target = e.srcElement || element;
			instance.timeStamp = +new Date();

			instance.preventDefault = function () {
				e.returnValue = false;
			};

			instance.stopPropagation = function () {
				e.cancelBubble = true;
			};
		};

		addEventListener = function (type, listener) {
			var element = this,
			    listeners,
			    i;

			listeners = element.listeners || (element.listeners = []);
			i = listeners.length;

			listeners[i] = [listener, function (e) {
				listener.call(element, new Event(e, element));
			}];

			element.attachEvent('on' + type, listeners[i][1]);
		};

		removeEventListener = function (type, listener) {
			var element = this,
			    listeners,
			    i;

			if (!element.listeners) {
				return;
			}

			listeners = element.listeners;
			i = listeners.length;

			while (i--) {
				if (listeners[i][0] === listener) {
					element.detachEvent('on' + type, listeners[i][1]);
				}
			}
		};

		window.addEventListener = document.addEventListener = addEventListener;
		window.removeEventListener = document.removeEventListener = removeEventListener;

		if ('Element' in window) {
			Element.prototype.addEventListener = addEventListener;
			Element.prototype.removeEventListener = removeEventListener;
		} else {
			head = document.getElementsByTagName('head')[0];
			style = document.createElement('style');

			head.insertBefore(style, head.firstChild);

			style.styleSheet.cssText = '*{-ms-event-prototype:expression(!this.addEventListener&&(this.addEventListener=addEventListener)&&(this.removeEventListener=removeEventListener))}';
		}

		addEventListener.simulant = true;
	}

	var simulant;

	try {
		new MouseEvent('click');
		simulant = modern();
	} catch (err) {
		if (!document.createEvent) {
			if (document.createEventObject) {
				simulant = ancient();
			} else {
				throw new Error('Events cannot be created in this browser');
			}
		} else {
			simulant = legacy();
		}
	}

	if (document.dispatchEvent) {
		simulant.fire = function (node, event, params) {
			if (typeof event === 'string') {
				event = simulant(event, params);
			}

			node.dispatchEvent(event);
			return event;
		};
	} else if (document.fireEvent) {
		simulant.fire = function (node, event, params) {
			if (typeof event === 'string') {
				event = simulant(event, params);
			}

			node.fireEvent('on' + event.type, event);

			// Special case - checkbox inputs
			if (node.tagName === 'INPUT' && node.type === 'checkbox') {
				node.click();
			}
			return event;
		};
	}

	simulant.polyfill = utils_polyfill;

	var _simulant = simulant;

	return _simulant;

}));
//# sourceMappingURL=simulant.js.map
