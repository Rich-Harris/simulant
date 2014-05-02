module.exports = function ( grunt ) {

	'use strict';

	grunt.registerTask( 'build', [
		'clean:tmp',
		'concat',
		'jshint',
		'qunit:main',
		'clean:build',
		'copy:build',
		'uglify'
	]);

};
