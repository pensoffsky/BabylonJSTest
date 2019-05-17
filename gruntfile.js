module.exports = function(grunt){
	'use strict';

	grunt.initConfig({
		connect: {
			server: {
				options: {
					port: 9000,
					base: '',
					hostname: 'localhost', 
					livereload: 35729,
					open: {
						target: 'http://localhost:9000'
					}
				}		
			}
		},
		watch: {
			reloadfiles: {
				files: ['**/*'],
				options: {
					livereload: true
				}
			}
		}

	});
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['connect', 'watch']);
};