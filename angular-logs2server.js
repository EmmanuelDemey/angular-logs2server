(function(){
	'use strict';

	angular.module('logs2server', ['ng'])
		.config(exceptionConfig)
		.provider('log2serverConfigService', log2serverConfigServiceFunction);

	exceptionConfig.$inject = ['$provide'];
	function exceptionConfig($provide) {
		$provide.decorator('$exceptionHandler', extendExceptionHandler);
	}

	extendExceptionHandler.$inject = ['$delegate', 'log2serverConfigService', '$injector'];
	function extendExceptionHandler($delegate, log2serverConfigService, $injector) {

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
			$delegate(exception, cause);
		};
	}

	log2serverConfigServiceFunction.$inject = [];
	function log2serverConfigServiceFunction(){
		var serverURL;

		this.setServerURL = function(url){
			serverURL = url;
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
