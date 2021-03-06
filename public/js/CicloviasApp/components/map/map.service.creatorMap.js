
// Responsabilidad :  Creacion de mapa  (implementando un Singleton para ser instanciado una sola vez desde
// los distintos controladores )
(function() {
    'use strict';
    // se hace referencia al modulo mapModule ya creado (esto esta determinado por la falta de [])
    angular.module('mapModule')
        .service('creatorMap', ['propiertiesMap', creatorMap]);

    function creatorMap(propiertiesMap) {

        var map = null;

        var service = {
            getMap: getMap,
            clearMap: clearMap
        };
        return service;

        // Retorna un mapa
        function getMap() {
            if (map == null) {
                map = createMap();
            }
            return map;
        };
        // Constructor de mapa
        function createMap() {
            var OSMLayer = new ol.layer.Tile({
                source: new ol.source.OSM()
            });

            map = new ol.Map({
                layers: [OSMLayer],
                target: 'map',
                view: new ol.View({
                    projection: propiertiesMap.PROJECTION,
                    center: [propiertiesMap.LONG_CENTER, propiertiesMap.LAT_CENTER],
                    zoom: propiertiesMap.ZOOM
                })
            });
            return map;
        }

        // Se limpia el mapa al cambiar de vista
        function clearMap() {
            map = null;
        }
    }

})()
