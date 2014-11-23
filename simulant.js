"use strict";

(function (global, factory) {
  "use strict";

  if (typeof define === "function" && define.amd) {
    // export as AMD
    define([], factory);
  } else if (typeof module !== "undefined" && module.exports && typeof require === "function") {
    // node/browserify
    module.exports = factory();
  } else {
    // browser global
    global.simulant = factory();
  }
}(typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var maps__defaults = {
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
    locale: "",
    oldURL: "",
    newURL: "",
    origin: "",
    lastEventId: "",
    source: null,
    ports: [],
    oldValue: null,
    newValue: null,
    url: "",
    storageArea: null,
    deltaX: 0,
    deltaY: 0,
    deltaZ: 0,
    deltaMode: 0
  };


  // TODO remove the ones that aren't supported in any browser
  var maps__eventTypesByGroup = {
    UIEvent: "abort error resize scroll select unload",
    Event: "afterprint beforeprint cached canplay canplaythrough change chargingchange chargingtimechange checking close dischargingtimechange DOMContentLoaded downloading durationchange emptied ended fullscreenchange fullscreenerror input invalid levelchange loadeddata loadedmetadata noupdate obsolete offline online open orientationchange pause pointerlockchange pointerlockerror play playing ratechange readystatechange reset seeked seeking stalled submit success suspend timeupdate updateready visibilitychange volumechange waiting",
    AnimationEvent: "animationend animationiteration animationstart",
    AudioProcessingEvent: "audioprocess",
    BeforeUnloadEvent: "beforeunload",
    TimeEvent: "beginEvent endEvent repeatEvent",
    FocusEvent: "blur focus focusin focusout",
    MouseEvent: "click contextmenu dblclick mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup show",
    SensorEvent: "compassneedscalibration userproximity",
    OfflineAudioCompletionEvent: "complete",
    CompositionEvent: "compositionend compositionstart compositionupdate",
    ClipboardEvent: "copy cut paste",
    DeviceLightEvent: "devicelight",
    DeviceMotionEvent: "devicemotion",
    DeviceOrientationEvent: "deviceorientation",
    DeviceProximityEvent: "deviceproximity",
    DragEvent: "drag dragend dragenter dragleave dragover dragstart drop",
    GamepadEvent: "gamepadconnected gamepaddisconnected",
    HashChangeEvent: "hashchange",
    KeyboardEvent: "keydown keypress keyup",
    ProgressEvent: "loadend loadstart progress timeout",
    MessageEvent: "message",
    PageTransitionEvent: "pagehide pageshow",
    PopStateEvent: "popstate",
    StorageEvent: "storage",
    SVGEvent: "SVGAbort SVGError SVGLoad SVGResize SVGScroll SVGUnload",
    SVGZoomEvent: "SVGZoom",
    TouchEvent: "touchcancel touchend touchenter touchleave touchmove touchstart",
    TransitionEvent: "transitionend",
    WheelEvent: "wheel"
  };

  var maps__eventGroupByType = {};

  Object.keys(maps__eventTypesByGroup).forEach(function (group) {
    var maps__types = maps__eventTypesByGroup[group].split(" ");

    maps__types.forEach(function (t) {
      maps__eventGroupByType[t] = group;
    });
  });


  // The parameters required by event constructors and init methods, in the order the init methods need them.

  // There is no initKeyboardEvent or initKeyEvent here. Keyboard events are a goddamned mess. You can't fake them
  // well in any browser - the which and keyCode properties are readonly, for example. So we don't actually use the
  // KeyboardEvent constructor, or the initKeyboardEvent or initKeyEvent methods. Instead we use a bog standard
  // Event and add the required parameters as expando properties.

  // TODO I think in some browsers we need to use modifiersList instead of ctrlKey/shiftKey etc?
  var maps__initialiserParams = {
    initUIEvent: "view detail",
    initMouseEvent: "view detail screenX screenY clientX clientY ctrlKey altKey shiftKey metaKey button relatedTarget",
    initCompositionEvent: "view detail data locale",
    initHashChangeEvent: "oldURL newURL",
    initMessageEvent: "data origin lastEventId source ports",
    initStorageEvent: "key oldValue newValue url storageArea",
    initWheelEvent: "view detail screenX screenY clientX clientY ctrlKey altKey shiftKey metaKey button relatedTarget deltaX deltaY deltaZ deltaMode"
  };

  Object.keys(maps__initialiserParams).forEach(function (initMethod) {
    maps__initialiserParams[initMethod] = maps__initialiserParams[initMethod].split(" ");
  });


  var maps__initialisersByGroup = {
    UIEvent: [window.UIEvent, "initUIEvent"],
    Event: [window.Event, "initEvent"],
    FocusEvent: [window.FocusEvent, "initUIEvent"],
    MouseEvent: [window.MouseEvent, "initMouseEvent"],
    CompositionEvent: [window.CompositionEvent, "initCompositionEvent"],
    HashChangeEvent: [window.HashChangeEvent, "initHashChangeEvent"],
    KeyboardEvent: [window.Event, "initEvent"],
    ProgressEvent: [window.ProgressEvent, "initEvent"],
    MessageEvent: [window.MessageEvent, "initMessageEvent"], // TODO prefixed?
    PageTransitionEvent: [window.PageTransitionEvent, "initEvent"],
    PopStateEvent: [window.PopStateEvent, "initEvent"],
    StorageEvent: [window.StorageEvent, "initStorageEvent"],
    TouchEvent: [window.TouchEvent, "initTouchEvent"],
    WheelEvent: [window.WheelEvent, "initWheelEvent"] // TODO this differs between browsers...
  };

  var extendWithKeyboardParams__keyboardParams = ["which", "keyCode", "shiftKey", "ctrlKey", "altKey", "metaKey"];

  function extendWithKeyboardParams__extendWithKeyboardParams(event, params) {
    var i = extendWithKeyboardParams__keyboardParams.length;
    while (i--) {
      event[extendWithKeyboardParams__keyboardParams[i]] = params[extendWithKeyboardParams__keyboardParams[i]];
    }
  }
  var extendWithKeyboardParams__default = extendWithKeyboardParams__extendWithKeyboardParams;

  var ancient__default = function () {
    var methodName, initialisers, makeInitialiser, simulant;

    initialisers = {};

    makeInitialiser = function (methodName, paramsList) {
      return function (event, type, params) {
        var paramName, i;

        event.type = type;

        i = paramsList.length;
        while (i--) {
          paramName = paramsList[i];
          event[paramName] = params[paramName] || maps__defaults[paramName];
        }
      };
    };

    for (methodName in maps__initialiserParams) {
      if (maps__initialiserParams.hasOwnProperty(methodName)) {
        initialisers[methodName] = makeInitialiser(methodName, maps__initialiserParams[methodName]);
      }
    }

    initialisers.initEvent = makeInitialiser("initEvent", []);

    simulant = function (type, params) {
      var event, group, initialiserName, initialise, isKeyboardEvent;

      group = maps__eventGroupByType[type];

      if (group === "KeyboardEvent") {
        isKeyboardEvent = true;
        group = "Event";
      }

      initialiserName = maps__initialisersByGroup[group][1];
      initialise = initialisers[initialiserName];

      event = document.createEventObject();
      initialise(event, type, params || {});

      if (isKeyboardEvent) {
        extendWithKeyboardParams__default(event, params);
      }

      return event;
    };

    simulant.mode = "ancient";
    return simulant;
  };

  var legacy__default = function () {
    var methodName, initialisers, makeInitialiser, simulant;

    initialisers = {};

    makeInitialiser = function (methodName, paramsList) {
      return function (event, type, params) {
        var args;

        // first three args are always `type`, `bubbles`, `cancelable`
        args = [type, true, true]; // TODO some events don't bubble?

        paramsList.forEach(function (paramName) {
          args.push(params[paramName] || maps__defaults[paramName]);
        });

        event[methodName].apply(event, args);
      };
    };

    Object.keys(maps__initialiserParams).forEach(function (methodName) {
      initialisers[methodName] = makeInitialiser(methodName, maps__initialiserParams[methodName]);
    });

    initialisers.initEvent = makeInitialiser("initEvent", []);

    simulant = function (type, params) {
      var event, group, initialiserName, initialise, isKeyboardEvent;

      group = maps__eventGroupByType[type];

      if (group === "KeyboardEvent") {
        isKeyboardEvent = true;
        group = "Event";
      }

      initialiserName = maps__initialisersByGroup[group][1];
      initialise = initialisers[initialiserName];

      event = document.createEvent(group);
      initialise(event, type, params || {});

      if (isKeyboardEvent) {
        extendWithKeyboardParams__default(event, params);
      }

      return event;
    };

    simulant.mode = "legacy";
    return simulant;
  };

  var modern__default = function () {
    var simulant = function (type, params) {
      if (params === undefined) params = {};
      var event, group, Constructor, paramsList, paramName, i, extendedParams, isKeyboardEvent;

      group = maps__eventGroupByType[type];

      if (group === "KeyboardEvent") {
        group = "Event"; // because you can't fake KeyboardEvents well in any browser
        isKeyboardEvent = true;
      }

      Constructor = maps__initialisersByGroup[group][0];

      extendedParams = {
        bubbles: true, // TODO some events don't bubble?
        cancelable: true
      };

      paramsList = maps__initialiserParams[maps__initialisersByGroup[group][1]];
      i = (paramsList ? paramsList.length : 0);

      while (i--) {
        paramName = paramsList[i];
        extendedParams[paramName] = (paramName in params ? params[paramName] : maps__defaults[paramName]);
      }

      event = new Constructor(type, extendedParams);

      if (isKeyboardEvent) {
        extendWithKeyboardParams__default(event, params);
      }

      return event;
    };

    simulant.mode = "modern";
    return simulant;
  };

  function polyfill__polyfill() {
    // https://gist.github.com/Rich-Harris/6010282 via https://gist.github.com/jonathantneal/2869388
    // addEventListener polyfill IE6+
    var Event, addEventListener, removeEventListener, head, style;

    Event = function (e, element) {
      var property, instance = this;

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
      var element = this, listeners, i;

      listeners = element.listeners || (element.listeners = []);
      i = listeners.length;

      listeners[i] = [listener, function (e) {
        listener.call(element, new Event(e, element));
      }];

      element.attachEvent("on" + type, listeners[i][1]);
    };

    removeEventListener = function (type, listener) {
      var element = this, listeners, i;

      if (!element.listeners) {
        return;
      }

      listeners = element.listeners;
      i = listeners.length;

      while (i--) {
        if (listeners[i][0] === listener) {
          element.detachEvent("on" + type, listeners[i][1]);
        }
      }
    };

    window.addEventListener = document.addEventListener = addEventListener;
    window.removeEventListener = document.removeEventListener = removeEventListener;

    if ("Element" in window) {
      Element.prototype.addEventListener = addEventListener;
      Element.prototype.removeEventListener = removeEventListener;
    } else {
      head = document.getElementsByTagName("head")[0];
      style = document.createElement("style");

      head.insertBefore(style, head.firstChild);

      style.styleSheet.cssText = "*{-ms-event-prototype:expression(!this.addEventListener&&(this.addEventListener=addEventListener)&&(this.removeEventListener=removeEventListener))}";
    }

    addEventListener.simulant = true;
  }
  var polyfill__default = polyfill__polyfill;

  var simulant__simulant;

  try {
    new MouseEvent("click");
    simulant__simulant = modern__default();
  } catch (err) {
    if (!document.createEvent) {
      if (document.createEventObject) {
        simulant__simulant = ancient__default();
      } else {
        throw new Error("Events cannot be created in this browser");
      }
    } else {
      simulant__simulant = legacy__default();
    }
  }

  if (document.dispatchEvent) {
    simulant__simulant.fire = function (node, event, params) {
      if (typeof event === "string") {
        event = simulant__simulant(event, params);
      }

      node.dispatchEvent(event);
      return event;
    };
  } else if (document.fireEvent) {
    simulant__simulant.fire = function (node, event, params) {
      if (typeof event === "string") {
        event = simulant__simulant(event, params);
      }

      node.fireEvent("on" + event.type, event);

      // Special case - checkbox inputs
      if (node.tagName === "INPUT" && node.type === "checkbox") {
        node.click();
      }
      return event;
    };
  }

  simulant__simulant.polyfill = polyfill__default;

  var simulant__default = simulant__simulant;

  return simulant__default;
}));