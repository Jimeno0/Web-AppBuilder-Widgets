define(['dojo/_base/declare',
  'jimu/BaseWidget',
  'esri/tasks/query',
  'esri/tasks/QueryTask',
  'dojo/dom-construct',
  'dojo/_base/array', 
  'dojo/dom',
  'dojo/on',
  'esri/layers/FeatureLayer',
  'esri/graphic',
  'esri/symbols/SimpleMarkerSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/symbols/SimpleFillSymbol',
  'esri/Color',
  'esri/config',
  'bootstrap/Dropdown',
  'bootstrap/Tab',
  'bootstrap/Modal'
 ],
  function(declare, BaseWidget,Query, QueryTask, domConstruct, arrayUtils, dom, on, FeatureLayer,Graphic,SimpleMarkerSymbol,SimpleLineSymbol,SimpleFillSymbol,Color,esriConfig) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {
      // Custom widget code goes here

      //Propiedades
      baseClass: 'jimu-widget-customwidget',

      startup: function() {
        //get config variables
        tableconfigParams = this.config.inPanelVar.params.tableConfigParams;
        queyconfigParams = this.config.inPanelVar.params.queryConfigParams;
        //Set table headers
        var cabecera = document.getElementById("cabeceraTabla").insertRow(0);
        for (i = 0; i < tableconfigParams.length; i++) {
          var contenidoCabecera = tableconfigParams[i].header;
          var newCell = cabecera.insertCell(i);
          newCell.innerHTML = contenidoCabecera;
        };
        //Set query dropdown menus
        for (i = 0; i < queyconfigParams.length; i++) {
          var btnName = queyconfigParams[i].buttonName;
          var dropDiv = domConstruct.create("div", {
            'class':"dropdown btn-group"
            }, "queryBtnsDiv");
          var queryBtn = domConstruct.create("button", {
            class:"btn btn-default dropdown-toggle",
            'innerHTML':btnName,
            'data-toggle':"dropdown",
            'aria-haspopup':"true",
            'aria-expanded':"false"
              }, dropDiv);
          var spanBtn = domConstruct.create("span", {class:"caret"}, queryBtn);
          var ulBtn = domConstruct.create("ul", {class:"dropdown-menu"}, dropDiv);
          for (n = 0; n < queyconfigParams[i].arrayTest.length; n++) {
            var liName = queyconfigParams[i].arrayTest[n].liName;
            var liQuery = queyconfigParams[i].arrayTest[n].query;
            var liBtn = domConstruct.create("li", {}, ulBtn);
            var aLiBtn = domConstruct.create("a", {
                    'innerHTML':liName,
                    'onClick' : "funcionQuery('" + liQuery + "');"
                    // 'data-dojo-attach-event':"onclick:funcionQueryliParams('"+liQuery+"')"
                    }, liBtn);
            };
          };
      },

      onOpen: function(){

                      this.inherited(arguments);
                      //Funcion para limpiar el contenido existente en la tabla
                      var node = document.getElementById('rutasUsers');
                      while (node.hasChildNodes()) {
                            node.removeChild(node.firstChild);
                      };
                      //Declaramos las variables para que se puedan llamar desde dentro de las funciones
                      mapa = this.map;
                      urlServicio = this.config.inPanelVar.params.urlServicio;
                      funciOnClick = funciOnClick2;
                      
                      funcionQuery = funcionQuery2;
                      //funcionQuery = funciOnClick2;

                      //Query que nos devuelve todos los elementos de la feature para que siempre que abramos el  widget nos dibuje toda la tabla
                      var query = new Query();
                      query.where ="1=1";


                      var OutFieldsArray = new Array();
                      
                      for (i = 0; i < tableconfigParams.length; i++) {
                        OutFieldsArray[i] = tableconfigParams[i].fieldName;
                      };
                      OutFieldsArray.push("OBJECTID");
                      

                      query.outFields = OutFieldsArray;
                      var queryTask = new QueryTask(urlServicio);
                      //var queryTask = new QueryTask('http://localhost:6080/arcgis/rest/services/Proyecto/ShareRoutes/MapServer/0');
                      queryTask.execute(query,addColumns);
                      //Para poder llamar a la funcion addColumns desde la funcion
                      addColumns2=addColumns;
                      //Funcion para que nos escriba las columnas de nuestra tabla
                      function addColumns(fsResult){
                            console.log("addColumns");
                            var features = fsResult.features;
                            //Funcion que nos recorre todos los elementos
                            arrayUtils.forEach(features, function(feature){
                                    var targetId = "OBJECTID="+feature.attributes["OBJECTID"];
                                    var featureRow = domConstruct.create("tr", {'onClick' : "funciOnClick('" + targetId + "');"}, "rutasUsers");
                                    for (i = 0; i < tableconfigParams.length; i++) {
                                        var attName = tableconfigParams[i].fieldName;
                                        var contenidoRow = feature.attributes[attName];
                                        

                                        var newCell = featureRow.insertCell(i);
                                        newCell.innerHTML = contenidoRow;
                                    };
                            });
                      };


                      //Funcion que se ejecuta al clicar sobre un elemento de la tabla para dibujar la ruta clicada
                      function funciOnClick2(e){
                              //Limpiamos la capa de graficos del mapa
                              debugger
                              mapa.graphics.clear();
                              //Query que extrae el elemento con el ID clicado de la tabla
                              var query2 = new Query();
                              query2.where =e;
                              query2.outFields = OutFieldsArray;
                              query2.returnGeometry = true;
                              query2.outSpatialReference = {wkid: 102100};
                              var queryTask2 = new QueryTask(urlServicio);
                              queryTask2.execute(query2,drawSelected);
                              //Funcion para dibujar la feature que nos devuelve la query
                              function drawSelected(fs){
                                      //var featureSelected = fs.features[0];
                                      
                                      for (i = 0; i < fs.features.length; i++) {
                                          var  featureSelected = fs.features[i];
                                          if (featureSelected.geometry.type == "point" ||featureSelected.geometry.type == "MultiPoint") {
                                            var simbologia = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10,
                                                                  new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                                                                  new Color([255,0,0]), 1),
                                                                  new Color([0,255,0,0.25]));
                                          } else if (featureSelected.geometry.type == "LineString" ||featureSelected.geometry.type == "MultiLineString") {
                                            var simbologia = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                                                                  new Color([255,0,0]),4);

                                          }else if (featureSelected.geometry.type == "Polygon" ||featureSelected.geometry.type == "MultiPolygon") {
                                            var simbologia = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                                                                  new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                                                                  new Color([255,0,0]), 2),new Color([255,255,0,0.25])
                                                                  );

                                          }


                                          var graphicElemnts = new Graphic(featureSelected.geometry,simbologia,featureSelected.attributes);
                                          mapa.graphics.add(graphicElemnts);
                                          mapa.centerAndZoom(featureSelected.geometry);
                                          //mapa.setExtent(featureSelected._extent);
                                          console.log(graphicElemnts);


                                      };




                              };
                      };
                      //¿REALIAR LA QUERY AQUI CON LOS PARAMETROS DE LA LI?¿ALMACENAR PARA LANZARLA DESDE
                      //LA FUNCION CONSULTA?
                      function funcionQuery2(e){

                              console.log(e);
                                //Borramos los elementos existentes de la tabla
                                var node = document.getElementById('rutasUsers');
                                while (node.hasChildNodes()) {
                                    node.removeChild(node.firstChild);
                                };
                                //Definimos la query segun los parametros que le pasemos a traves de las funciones definidas despues
                                var query = new Query();
                                query.where = e;
                                query.outFields = OutFieldsArray;
                                query.returnGeometry = true;
                                var queryTask = new QueryTask(urlServicio);
                                //Al ejecutarla llamamos a las funciones definidas anteriormente para rellenar la tabla con la información de las rutas 
                                //y que al clicar en cada una nos la dibuje en el mapa
                                queryTask.execute(query,addColumns2);

                      };

       X},
      onClose: function(){
        this.map.graphics.clear();
       },
    });
  });