var Main = (function() {
    'use strict';

    function MainController(countryDataFactory) {
        
        // Functions for data manipulation
        this.preference = countryDataFactory.getCountry;
        this.exchangeRateFunc = countryDataFactory.exchangeRateFunc;
        this.startOver = countryDataFactory.startOver;
        this.getDistance = countryDataFactory.getDistance;

        // Data for trip types
        this.tripTypes = countryDataFactory.tripTypes;

        // Indicators for spinners
        this.loadingMain = false;
        this.loadingCurrencies = false;
        this.loadingDistance = false;
        
        // Placeholder for exchange rates
        this.exchangeRate = null;

        // Placeholder for distance calculation
        this.distance = null;

        // Placeholder for suggestions
        this.suggestion = null;
    }

    MainController.$inject = ['countryDataFactory'];

    var app = angular.module('app', ['restangular', 'angularSpinner'])

    .factory('spinnerFactory', ['usSpinnerService', function (usSpinnerService) {
        
        function startSpin(scope, loadingObject, spinnerName){
            scope[loadingObject] = true;
            usSpinnerService.spin(spinnerName);
        }

        function stopSpin (scope, loadingObject, spinnerName){
            scope[loadingObject] = false;
            usSpinnerService.stop(spinnerName);
        }
    
        return {
            startSpin: startSpin,
            stopSpin: stopSpin
        };
    }])

    .factory('countryDataFactory', ['Restangular', 'spinnerFactory', function (Restangular, spinnerFactory) {

        var APIURL = 'http://localhost:5000/';
        var API = Restangular.setBaseUrl(APIURL);

        var stopSpin = spinnerFactory.stopSpin;
        var startSpin = spinnerFactory.startSpin;

        var tripTypes = {
            danger: {
                name: 'danger',
                desc: 'In need of the adrenaline rush that only fearing for you life can provide? Is having great stories more important to you than worrying about little things like continuing to breathe? These destinations might be for you - just don\'t forget your kevlar!'
            },
            relaxation: {
                name: 'relaxation',
                desc: 'Are you a busy professional who never gets a chance to decompress? Do you worry that you\'ve become a hopeless workaholic? Then we suggest you visit one of these majestic countries.'
            },
            excitement: {
                name: 'excitement',
                desc: 'Do you feel like life is passing you by? Are you constantly worrying that you won\'t have any adventures to look back on when you\'re old? You should consider jumping into the chaos of these countries.'
            },
            romance: {
                name: 'romance',
                desc: 'Want to get away with a significant other - or maybe find a new one? These destinations can help anybody who wants to make romantic connections with other people.'
            }

        };

        function startOver(scope) {
            // Reset suggestions
            scope.suggestion = {};
            scope.exchangeRate = null;
            scope.origin = null;
            scope.distance = null;
        }

        function exchangeRateFunc(scope, currency) {
            // Compare a currency to USD
            scope.exchangeRate = null;
            startSpin(scope, 'loadingCurrencies', 'currencies');

            var currencyEndPoint = Restangular.all('rates/' + currency);

            return currencyEndPoint.getList().then(
                function(msg) {
                    stopSpin(scope, 'loadingCurrencies', 'currencies');
                    scope.exchangeRate = msg[0];
                },
                function(err) {
                    stopSpin(scope, 'loadingCurrencies', 'currencies');
                    console.log('Error:', err);
                }
            );

        }

        function getCountry(scope, preference) {
            // Pull data about country based on user's preferences
            startSpin(scope, 'loadingMain', 'main');
            scope.suggestion = null;
            var prefEndPoint = Restangular.all('prefs/' + preference);

            return prefEndPoint.getList().then(
                function(msg) {
                    stopSpin(scope, 'loadingMain', 'main');
                    scope.suggestion = msg[0];
                },
                function(err) {
                    stopSpin(scope, 'loadingMain', 'main');
                    console.log('Error:', err);
                });
        }

        function getDistance(scope, origin, destination) {
            // Use backend to calculate distance between two places
            startSpin(scope, 'loadingDistance', 'distance');
            scope.distance = null;
            var distanceEndPoint = Restangular.all('distance/' + origin + '/' + destination);

            return distanceEndPoint.getList().then(
                function(msg) {
                    stopSpin(scope, 'loadingDistance', 'distance');
                    scope.distance = msg[0].distance;
                },
                function(err) {
                    stopSpin(scope, 'loadingDistance', 'distance');
                    console.log('Error:', err);
                });

        }

        return {
            getCountry: getCountry,
            startOver: startOver,
            tripTypes: tripTypes,
            exchangeRateFunc: exchangeRateFunc,
            getDistance: getDistance
        };
    }])

    .directive('appdata', [function () {
        return {
            bindToController: true,
            controller: MainController,
            controllerAs: 'app'
        };
    }])

    .directive('main', [function () {
        return {
            restrict: 'E',
            templateUrl: '/templates/main.html'
        };
    }])

    .directive('navbar', [function() {
            return {
                restrict: 'E',
                templateUrl: '/templates/navbar.html'
            };
        }
    ])

    .directive('prefs', [function() {
            return {
                restrict: 'E',
                templateUrl: '/templates/prefs.html'
            };
        }
    ])

    .directive('results', [function() {
            return {
                restrict: 'E',
                templateUrl: '/templates/results.html'
            };
        }
    ])

    .directive('info', [function() {
            return {
                restrict: 'E',
                templateUrl: '/templates/info.html'
            };
        }
    ])

    .directive('distance', [function() {
            return {
                restrict: 'E',
                templateUrl: '/templates/distance.html'
            };
        }
    ]);

})();