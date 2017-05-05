// Creacion de los dibujos de las zonas
(function() {
    'use strict';
    // se hace referencia al modulo mapModule ya creado (esto esta determinado por la falta de [])
    angular.module('mapModule')
    .factory('dataServer', ['$http', '$q', 'path', dataServer]);

    function dataServer($http, $q, path){
        var service = {
            // Zonas
            getZones: getZones,

            // Trips
            getTrips:getTrips,
            getTripsCloseToPoint:getTripsCloseToPoint,

            // Centralidades
            getCentralities: getCentralities,
            saveCentrality: saveCentrality,
            updateCentrality: updateCentrality,
            deleteCentrality: deleteCentrality
        };
        return service;

        // dado los puntos de una zona, devuelve un vector con esos puntos
        function getZones() {
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'GET',
                url: path.ZONE
            }).then(function successCallback(res) {
                    defered.resolve(res.data);
                    console.log('datos de promise ZONES: ' + res.data);
                    console.log('datos de promise ZONES color: ' + ((res.data)[0]).color);
                },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        };

        function getCentralities() {
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'GET',
                url: path.CENTRALITY
            }).then(function successCallback(res) {
                defered.resolve(res.data);
                console.log('datos de promise CENTRALITY: ' + res.data);
                },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );
            return promise;
        };

        function saveCentrality(newCentrality) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: path.CENTRALITY,
                data: newCentrality
            }).then(function successCallback(res) {
                defered.resolve(res.data);
                // console.log('datos de promise CENTRALITY: '+res.data);
                },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        };

        function updateCentrality(centrality) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'PUT',
                url: path.CENTRALITY+'/'+centrality.id,
                data: centrality
            }).then(function successCallback(res) {
                defered.resolve(res.data);
                // console.log('datos de promise CENTRALITY: '+res.data);
                },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        };

        function deleteCentrality(centralityId) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'DELETE',
                url: path.CENTRALITY+'/'+centralityId,
            }).then(function successCallback(res) {
                defered.resolve(res.data);
                // console.log('datos de promise CENTRALITY: '+res.data);
                },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );

            return promise;
        };

        function getTrips() {
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'GET',
                url: path.TRIP
            }).then(function successCallback(res) {
                defered.resolve(res.data);
                console.log('datos de promise TRIP: ' + res.data);
                },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );
            return promise;
        };

        function getTripsCloseToPoint(point) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'GET',
                url: path.TRIP + '/closeToPoint/' + point.latitude + '/' + point.longitude
            }).then(function successCallback(res) {
                defered.resolve(res.data);
                console.log('datos de promise TRIP: ' + res.data);
                },
                function errorCallback(err) {
                    defered.reject(err)
                }
            );
            return promise;
        };
    }
})()
