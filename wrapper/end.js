// export as Common JS module...
if ( typeof module !== "undefined" && module.exports ) {
	module.exports = simulant;
}

// export as AMD module
if ( typeof define === "function" && define.amd ) {
	define( function () {
		return simulant;
	});
}

// ... or as CommonJS module
else if ( typeof module !== 'undefined' && module.exports ) {
	module.exports = simulant;
}

// ... or as browser global
else {
	global.simulant = simulant;
}

}( typeof window !== 'undefined' ? window : this ));
