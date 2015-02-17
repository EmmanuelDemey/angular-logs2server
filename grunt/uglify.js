(function () {
	'use strict';
	/**
	* https://www.npmjs.com/package/grunt-contrib-uglify
	*/
	module.exports = {
		min: {
			files: {
				'angular-logs2server.min.js': ['angular-logs2server.js']
			}
		}
	};
})();
