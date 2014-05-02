module.exports = {
	build: {
		files: [{
			expand: true,
			cwd: 'tmp/',
			src: [ '**/*' ],
			dest: 'build/'
		}]
	},
	release: {
		files: [{
			expand: true,
			cwd: 'build/',
			src: [ '**/*' ],
			dest: 'release/<%= pkg.version %>/'
		}]
	},
	link: {
		files: {
			'simulant.js': 'build/simulant.js'
		}
	}
};
