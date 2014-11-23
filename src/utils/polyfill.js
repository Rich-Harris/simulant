export default function polyfill () {

	// https://gist.github.com/Rich-Harris/6010282 via https://gist.github.com/jonathantneal/2869388
	// addEventListener polyfill IE6+
	var Event, addEventListener, removeEventListener, head, style;

	Event = function ( e, element ) {
		var property, instance = this;

		for ( property in e ) {
			instance[ property ] = e[ property ];
		}

		instance.currentTarget =  element;
		instance.target = e.srcElement || element;
		instance.timeStamp = +new Date();

		instance.preventDefault = function () {
			e.returnValue = false;
		};

		instance.stopPropagation = function () {
			e.cancelBubble = true;
		};
	};

	addEventListener = function ( type, listener ) {
		var element = this, listeners, i;

		listeners = element.listeners || ( element.listeners = [] );
		i = listeners.length;

		listeners[i] = [ listener, function (e) {
			listener.call( element, new Event( e, element ) );
		}];

		element.attachEvent( 'on' + type, listeners[i][1] );
	};

	removeEventListener = function ( type, listener ) {
		var element = this, listeners, i;

		if ( !element.listeners ) {
			return;
		}

		listeners = element.listeners;
		i = listeners.length;

		while ( i-- ) {
			if ( listeners[i][0] === listener ) {
				element.detachEvent( 'on' + type, listeners[i][1] );
			}
		}
	};

	window.addEventListener = document.addEventListener = addEventListener;
	window.removeEventListener = document.removeEventListener = removeEventListener;

	if ( 'Element' in window ) {
		Element.prototype.addEventListener = addEventListener;
		Element.prototype.removeEventListener = removeEventListener;
	} else {
		head = document.getElementsByTagName('head')[0];
		style = document.createElement('style');

		head.insertBefore( style, head.firstChild );

		style.styleSheet.cssText = '*{-ms-event-prototype:expression(!this.addEventListener&&(this.addEventListener=addEventListener)&&(this.removeEventListener=removeEventListener))}';
	}

	addEventListener.simulant = true;
}