module.exports = {
	options: {
		process: {
			data: { version: '<%= pkg.version %>' }
		}
	},
	main: {
		src: [ 'wrapper/begin.js', 'src/maps/*.js', 'src/variations/*.js', 'src/utils/*.js', 'src/simulant.js', 'src/simulant.fire.js', 'src/simulant.polyfill.js', 'wrapper/end.js' ],
		dest: 'tmp/simulant.js'
	}
};
