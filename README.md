Simulant.js - simulated DOM events for automated testing
========================================================

Sometimes you need to create fake DOM events so that you can test the parts of your app or library that depend on user input. But doing so is a royal pain in the arse:

```js
// WITHOUT SIMULANT.JS
try {
  // DOM Level 3
  event = new MouseEvent( 'mousemove', {
    bubbles: true,
    cancelable: true,
    relatedTarget: previousNode
  });

  node.dispatchEvent( event );
}

catch ( err ) {
  if ( document.createEvent ) {
    // DOM Level 2
    event = document.createEvent( 'MouseEvents' );
    event.initMouseEvent( 'mousemove', true, true, window, null, 0, 0, 0, 0, '', false, false, false, false, 0, previousNode );

    node.dispatchEvent( event );
  }

  else {
    // IE8 and below
    event = document.createEventObject();
    event.relatedTarget = previousNode;

    node.fireEvent( 'onmousemove', event );
  }
}


// WITH SIMULANT.JS
simulant.fire( node, 'mousemove', { relatedTarget: previousNode });
```

Simulant was created to make automated testing of [Ractive.js](https://github.com/Rich-Harris/Ractive) across different browsers easier.


Why not just use jQuery?
------------------------

In some cases you can. But events created with `$( element ).trigger( 'click' )`, for example, won't trigger handlers bound using `element.addEventListener( 'click', handler )` in many situations, such as when you're doing automated tests with [PhantomJS](http://phantomjs.org/) (which was my initial motivation - [grunt-contrib-qunit](https://github.com/gruntjs/grunt-contrib-qunit), which runs the tests for Ractive.js, uses PhantomJS).

Simulant uses native DOM events, not fake events, so its behaviour is more predictable.


Usage
-----

```js
// Create a simulated event
event = simulant( 'click' );

// Create a simulated event with parameters, e.g. a middle-click
event = simulant( 'click', { button: 1, which: 2 });

// Fire a previously created event
target = document.getElementById( 'target' );
simulant.fire( target, event );

// Create an event and fire it immediately
simulant.fire( target, 'click' );
simulant.fire( target, 'click', { button: 1, which: 2 });

// Polyfill addEventListener in old browsers
if ( !window.addEventListener ) {
  simulant.polyfill();
}
```


Limitations
-----------

Normally, events have side-effects - a click in a text input will focus it, a mouseover of an element will trigger its hover state, and so on. When creating events programmatically, these side-effects don't happen - so your tests shouldn't expect them to. For example you shouldn't fire simulated keypress events at an input element and expect its value to change accordingly.

There are exceptions - a click event on a checkbox input will cause a secondary change event to be fired, for example.


Caveats
-------

This is an early version - expect bugs and quirks. Better yet, help me [find them and fix them](https://github.com/Rich-Harris/Simulant/issues)!


License
-------

Copyright (c) 2013 [Rich Harris](http://rich-harris.co.uk) ([@rich_harris](http://twitter.com/rich_harris)).
Released under an MIT license.
