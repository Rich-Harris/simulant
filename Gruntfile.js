/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON( 'package.json' ),
		watch: {
			js: {
				files: [ 'src/**/*.js', 'wrapper/**/*.js' ],
				tasks: [ 'clean:tmp', 'concat' ],
				options: {
					interrupt: true,
					force: true
				}
			}
		},
		qunit: {
			main: [ 'test/index.html' ],
			jquery: [ 'test/jquery.html' ]
		},
		concat: {
			options: {
				process: {
					data: { version: '<%= pkg.version %>' }
				}
			},
			main: {
				src: [ 'wrapper/begin.js', 'src/maps/*.js', 'src/variations/*.js', 'src/utils/*.js', 'src/simulant.js', 'src/simulant.fire.js', 'src/simulant.polyfill.js', 'wrapper/end.js' ],
				dest: 'tmp/simulant.js'
			}
		},
		clean: {
			tmp: [ 'tmp/' ],
			build: [ 'build/' ]
		},
		jshint: {
			files: [ '<%= concat.main.dest %>' ],
			options: {
				jshintrc: '.jshintrc'
			}
		},
		uglify: {
			main: {
				src: ['<%= concat.main.dest %>'],
				dest: 'build/simulant.min.js'
			}
		},
		copy: {
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
		}
	});

	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-qunit' );
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	
	grunt.registerTask( 'default', [
		'clean:tmp',
		'concat',
		'jshint',
		'qunit:main',
		'clean:build',
		'copy:build',
		'uglify'
	]);

	grunt.registerTask( 'release', [ 'default', 'copy:release', 'copy:link' ] );

};
