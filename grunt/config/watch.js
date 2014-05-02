module.exports = {
	js: {
		files: [ 'src/**/*.js', 'wrapper/**/*.js' ],
		tasks: [ 'clean:tmp', 'concat' ],
		options: {
			interrupt: true,
			force: true
		}
	}
};
