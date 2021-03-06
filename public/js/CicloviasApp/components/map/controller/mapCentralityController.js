// Responsabilidad: Controlar el modulo de centralidades, permite solo visualizar las centralidades
(function() {
    'use strict';
    // Se llama al modulo "mapModule"(), seria una especie de get
    angular.module('mapModule')
        .controller('mapCentralityController', [
            '$scope',
            'creatorMap',
            'srvLayers',
            'srvModelCentrality',
            'dataServer',
            'srvViewCentrality',
            'adminMenu',
            MapCentralityController
        ]);

        function MapCentralityController(vm, creatorMap, srvLayers, srvModelCentrality, dataServer, srvViewCentrality, adminMenu) {

        // ********************************** VARIABLES PUBLICAS ************************
        // Mapa
        vm.map = creatorMap.getMap();
        // Lista de centralidades obtenidas del servidor
        vm.centralitiesJson = [];
        // capa de centralidades
        vm.centralitiesLayer;

        vm.pageSize = 5,
            vm.currentPage = 1;
        vm.totalItems = vm.centralitiesJson.length;

        // ********************************** FLAGS PUBLICOS ****************************
        // Indica si todas las centralidades han si selecionadas
        vm.selectedAllCentralities = false;
        // Determina el estado del menu (abierto o cerrado)
        vm.openMenuCentralities = false;

        // **************************DECLARACION DE FUNCIONES PUBLICAS ****************************

        // Agrega o Borra TODAS las centralidades al mapa, Al hacer click en Ver todo
        vm.checkAllCentralities = checkAllCentralities;
        // permite la visualizacion o no de una centralidad
        vm.selectCentrality = selectCentrality;
        // recupera la lista de las centralidades desde su contenedor (singleton),
        // para actualizar la vista de las centralidades al agregar o borrar una centralidad
        vm.getCentralities = getCentralities;


        // ********************************** VARIABLES PRIVADAS ************************
        // variable que contiene los datos del popup visualizado en el mapa
        var popup = null;

        // ************************DECLARACION DE FUNCIONES PRIVADAS ********************

        // MENU: deshabilita los eventos de los demas menues y habilita los correspondientes a este
        var enableEventClick;
        // recupera los datos del servidor y los guarda en una variable
        var findAllCentralities;
        // Generacion de Capa de Centralidades a partir del json recibido desde el service
        var generateCentralitiesPoints;

        // ****************************** FUNCIONES PUBLICAS ****************************

        function checkAllCentralities() {
            if (vm.selectedAllCentralities) {
                vm.selectedAllCentralities = false;
                vm.centralitiesLayer.getSource().clear();
            } else {
                vm.selectedAllCentralities = true;
                srvViewCentrality.addCentralities(srvModelCentrality.getCentralities(), srvModelCentrality.getCentralitiesLayer());
            }

            angular.forEach(srvModelCentrality.getCentralities(), function(centrality) {
                centrality.selected = vm.selectedAllCentralities;
            });
        }

        function selectCentrality(centrality) {
            srvViewCentrality.viewCentrality(centrality, vm.centralitiesLayer);
        }

        function getCentralities() {
            return srvModelCentrality.getCentralities();
        }


        // ************************ FUNCIONES PRIVADAS **********************************

        function findAllCentralities() {
            if (! srvModelCentrality.isCentralitiesWanted()) {
                dataServer.getCentralities()
                    .then(function(data) {
                        // una vez obtenida la respuesta del servidor realizamos las sigientes acciones
                        vm.centralitiesJson = data;
                        srvModelCentrality.setCentralitiesWanted(true);
                        vm.totalItems = vm.centralitiesJson.length;
                        console.log("Datos recuperados con EXITO! = CENTRALIDADES");
                        // Setea las centralidades
                        srvModelCentrality.setCentralities(vm.centralitiesJson);
                        generateCentralitiesPoints();
                    })
                    .catch(function(err) {
                        console.log("ERRRROOORR!!!!!!!!!! ---> Al cargar las CENTRALIDADES");
                    })
            }
        }

        function generateCentralitiesPoints() {
            // Se crea y agrega la capa de Centralidades al mapa
            vm.centralitiesLayer = srvLayers.getLayer(null); //TODO a refactorizar
            srvModelCentrality.setCentralitiesLayer(vm.centralitiesLayer);
            vm.map.addLayer(vm.centralitiesLayer);
        }


        // ************************ EVENTOS ****************************************
        // muestra los datos de la centralidad al hacerle click en el mapa
        vm.map.on('click', function(evt) {
            if (adminMenu.activeCentralities()) {
                var feature = vm.map.forEachFeatureAtPixel(evt.pixel,
                    function(feature) {
                        // borra el popup anterior
                        if (popup != null) {
                            popup.container.style.display = 'none';
                        }
                        var coordinates = feature.getGeometry().getCoordinates();
                        popup = new ol.Overlay.Popup({
                            // insertFirst: false
                        });
                        vm.map.addOverlay(popup);
                        popup.show(evt.coordinate, srvModelCentrality.getCentrality(feature.getId()).name);

                        // setTimeout(function() {
                        //     popup.container.style.display = 'none';
                        //     popup = null;
                        // }, 3000);

                        return feature;
                    });
            }
        });

        // se encarga de observar si el menu se encuentra abierto o cerrado
        vm.$watch('openMenuCentralities', function(isOpen) {
            if (isOpen) {
                console.log('El menu de CENTRALIDADES esta abierto');
                enableEventClick();
            }
        });

        function enableEventClick() {
            adminMenu.disableAll();
            adminMenu.setActiveCentralities(true);
            console.log('Entro a actualizacion de eventos CENTRALITIES');
        }

        // ************************ Inicializacion de datos *****************************
        generateCentralitiesPoints();
        findAllCentralities();

    } // fin Constructor

})()
