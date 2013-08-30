// export as AMD module
if ( typeof define === "function" && define.amd ) {
	define( function () {
		return simulant;
	});
}

// ... or as browser global
else {
	global.simulant = simulant;
}

}( typeof window !== 'undefined' ? window : this ));