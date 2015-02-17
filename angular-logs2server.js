(function(){
	'use strict';

	/**
	 * @ngdoc module
	 * @name logs2server
	 * @module logs2server
	 * @description
	 *
	 * # logs2server
	 * The logs2server module will provide a decorator to the ExceptionHandler service. You will be able to send
	 * to your server any client-side exception (throw Error("message")), and this exception will be sent to your
	 * server, with some complementary informations (navigator object, $location informations, ...)
	 */
	angular.module('logs2server', ['ng'])
		.config(exceptionConfig)
		.provider('log2serverConfigService', log2serverConfigServiceProvider);

	exceptionConfig.$inject = ['$provide'];
	function exceptionConfig($provide) {
		$provide.decorator('$exceptionHandler', extendExceptionHandler);
	}

	extendExceptionHandler.$inject = ['$delegate', 'log2serverConfigService', '$injector'];
	function extendExceptionHandler($delegate, log2serverConfigService, $injector) {
		/**
		 * @ngdoc function
		 * @name generateNavigatorData
		 * @module logs2server
		 * @kind function
		 *
		 * @returns {object} Object containing some Navigator property
		 */
		function generateNavigatorData(){
			var $window = $injector.get('$window');
			return {
				appCodeName: $window.navigator.appCodeName,
				appName: $window.navigator.appName,
				appVersion: $window.navigator.appVersion,
				cookieEnabled: $window.navigator.cookieEnabled,
				hardwareConcurrency: $window.navigator.hardwareConcurrency,
				language: $window.navigator.language,
				languages: $window.navigator.languages,
				maxTouchPoints: $window.navigator.maxTouchPoints,
				onLine: $window.navigator.onLine,
				platform: $window.navigator.platform,
				product: $window.navigator.product,
				productSub: $window.navigator.productSub,
				userAgent: $window.navigator.userAgent,
				vendor: $window.navigator.vendor,
				vendorSub: $window.navigator.vendorSub
			};
		}

		/**
		 * @ngdoc function
		 * @name generateLocationData
		 * @module logs2server
		 * @kind function
		 *
		 * @returns {object} Object containing ^the result of some $location methods
		 */
		function generateLocationData(){
			var $location = $injector.get('$location');
			return {
				absUrl: $location.absUrl(),
				hash: $location.hash(),
				host: $location.host(),
				path: $location.path(),
				port: $location.port(),
				protocol: $location.protocol(),
				url: $location.url()
			};
		}

		return function (exception, cause) {
			var serverURL = log2serverConfigService.getUrl();
			if(angular.isDefined(serverURL)){
				var data = {
					exception: exception,
					cause: cause,
					navigator: generateNavigatorData(),
					location: generateLocationData()
				};
				$injector.get('$http').post(serverURL, data);
			}
			if(log2serverConfigService.getDefaultExceptionHandler()){
				$delegate(exception, cause);
			}
		};
	}

	/**
	 * @ngdoc provider
	 * @name $log2serverConfigServiceProvider
	 * @description
	 * The provider is used to configure the exceptionHandler decorator provided by the logs2server module.
	 *
	 * This provider allows the configuration of the log2server module with :
	 * {@link logs2server.$log2serverConfigServiceProvider#setServerURL setServerURL} method.
	 * {@link logs2server.$log2serverConfigServiceProvider#setDefaultExceptionHandler setDefaultExceptionHandler} method.
	 */
	log2serverConfigServiceProvider.$inject = [];
	function log2serverConfigServiceProvider(){
		var serverURL;
		var defaultExceptionHandler = true;

		/**
		* @ngdoc method
		* @name $log2serverConfigServiceProvider#setServerURL
		* @param {string} url URL of the REST API receiving the logs, via a POST request.
		*/
		this.setServerURL = function(url){
			serverURL = url;
		};

		/**
		* @ngdoc method
		* @name $log2serverConfigServiceProvider#setDefaultExceptionHandler
		* @param {boolean} flag Indicate if the default exceptionHandler behavior should be enabled.
		*/
		this.setDefaultExceptionHandler = function(flag){
			defaultExceptionHandler = flag;
		};
		this.$get = [function(){
			return {
				getUrl: function(){
					return serverURL;
				}
			};
		}];
	}
})();
