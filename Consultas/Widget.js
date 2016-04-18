define(['dojo/_base/declare',
 'jimu/BaseWidget',
  "esri/tasks/query",
  "esri/tasks/QueryTask",
  "dojo/dom-construct",
  "dojo/_base/array", 
  "dojo/dom",
  "dojo/on",
  "esri/layers/FeatureLayer",
  'esri/graphic',
  'esri/symbols/SimpleLineSymbol',
  'esri/Color',
  'esri/InfoTemplate',
  'esri/dijit/InfoWindowLite',
  "esri/config",
  'bootstrap/Dropdown',
  'bootstrap/Tab',
  'bootstrap/Modal'
 ],
  function(declare, BaseWidget,Query, QueryTask, domConstruct, arrayUtils, dom, on, FeatureLayer,Graphic,SimpleLineSymbol,Color, InfoTemplate,InfoWindowLite,esriConfig) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {
      // Custom widget code goes here

      //Propiedades
      baseClass: 'jimu-widget-customwidget',
      dificultad: "1=1",
      distancia:"1=1",
      tiempo:"1=1",

      startup: function() {
              //Creamos la simbologia que emplearan nuestras rutas
              sls = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([255,0,0]),4);

      },

      onOpen: function(){
              //Creamos el infowindow de nuestro widget
              var infoWindow = new InfoWindowLite(null, domConstruct.create("div", null, null, this.map.root));
              infoWindow.startup();
              this.map.setInfoWindow(infoWindow);
              this.map.infoWindow.resize(200, 250);
              //Creamos el infowtemplate                        
              infoTemplate = new InfoTemplate();
              infoTemplate.setTitle("<strong>Información de ruta</strong>");
              infoTemplate.setContent("hello");
              infoTemplate.setContent(getTextContent);
              //Definimos la función que nos devuelve el contenido del infoTemplate
              function getTextContent(graphic){

                        if (graphic.attributes["Dificultad"]==1) {
                          var dificultadInfo = "Facil";
                        }else if (graphic.attributes["Dificultad"]==2) {
                          var dificultadInfo = "Media";
                        }else if (graphic.attributes["Dificultad"]==3) {
                          var dificultadInfo = "Trialera";
                        };

                        var nombreRuta = graphic.attributes["NombreRuta"];
                        var usuarios = graphic.attributes["Usuario"];
                        var longitud = Math.round(graphic.attributes["SHAPE.STLength()"]);
                        var minutos = graphic.attributes["Minutos"];
                        var segundos = graphic.attributes["Segundos"];
                        var Comentario = graphic.attributes["Comentario"];
                        
                        return "<b>Nombre de la ruta:</b> "+nombreRuta+"<br><b>Usuario:</b> "+usuarios+"<br><b>Dificultad:</b> "+
                        dificultadInfo+"<br><b>Distancia:</b> " +longitud + " m <br><b>Tiempo:</b> " + minutos + "'  " +
                         segundos + "''<br><b>Comentarios:</b> "+Comentario;


              };

                      this.inherited(arguments);
                      //Funcion para limpiar el contenido existente en la tabla
                      var node = document.getElementById('rutasUsers');
                      while (node.hasChildNodes()) {
                            node.removeChild(node.firstChild);
                      };
                      //Declaramos las variables para que se puedan llamar desde dentro de las funciones
                      mapa = this.map;
                      funciOnClick = funciOnClick2;
                      //Query que nos devuelve todos los elementos de la feature para que siempre que abramos el  widget nos dibuje toda la tabla
                      var query = new Query();
                      query.where =this.dificultad;
                      query.outFields = ["NombreRuta","Usuario","Dificultad","Minutos","Segundos","SHAPE.STLength()","OBJECTID"];
                      var queryTask = new QueryTask('http://localhost:6080/arcgis/rest/services/Proyecto/ShareRoutes/MapServer/0');
                      queryTask.execute(query,addColumns);
                      //Para poder llamar a la funcion addColumns desde la funcion
                      addColumns2=addColumns;
                      //Funcion para que nos escriba las columnas de nuestra tabla
                      function addColumns(fsResult){
                            var features = fsResult.features;
                            //Funcion que nos recorre todos los elementos
                            arrayUtils.forEach(features, function(feature){

                                      if (feature.attributes["Dificultad"]==1) {
                                        var dificultad = "Facil";
                                      }else if (feature.attributes["Dificultad"]==2) {
                                        var dificultad = "Media";
                                      }else if (feature.attributes["Dificultad"]==3) {
                                        var dificultad = "Trialera";
                                      };
                                      //Creamos y rellenamos todos los elementos de nuestra tabla
                                      //En cada fila establecemos que el evento onclick llame a la funcion funcionAlerta definida anteriormente
                                      var tr = domConstruct.create("tr", {'onClick' : "funciOnClick('" + feature.attributes["OBJECTID"] + "');"}, "rutasUsers"),
                                      td = domConstruct.create("td", {}, tr),
                                      l = domConstruct.create("span", {innerHTML:feature.attributes["NombreRuta"]}, td, 'first'),
                                      td1 = domConstruct.create("td", {}, tr),
                                      l1 = domConstruct.create("span", {innerHTML:feature.attributes["Usuario"]}, td1, 'first'),
                                      td11 = domConstruct.create("td", {}, tr),
                                      l11 = domConstruct.create("span", {innerHTML:dificultad}, td11, 'first'),
                                      td12 = domConstruct.create("td", {}, tr),
                                      l12 = domConstruct.create("span", {innerHTML:feature.attributes["Minutos"]+"'' "+feature.attributes["Segundos"]+"'" }, td12, 'first'),
                                      td13 = domConstruct.create("td", {}, tr),
                                      l11 = domConstruct.create("span", {innerHTML:Math.round(feature.attributes["SHAPE.STLength()"])+"m"}, td13, 'first');
                            });
                      };
                      //Funcion que se ejecuta al clicar sobre un elemento de la tabla para dibujar la ruta clicada
                      function funciOnClick2(e){
                              //Limpiamos la capa de graficos del mapa
                              mapa.graphics.clear();
                              //Query que extrae el elemento con el ID clicado de la tabla
                              var query2 = new Query();
                              query2.where ="OBJECTID="+e;
                              query2.outFields = ["NombreRuta","Usuario","Dificultad","Minutos","Segundos","SHAPE.STLength()","OBJECTID","Comentario","Imagen"];
                              query2.returnGeometry = true;
                              query2.outSpatialReference = {wkid: 102100};
                              var queryTask2 = new QueryTask('http://localhost:6080/arcgis/rest/services/Proyecto/ShareRoutes/MapServer/0');
                              queryTask2.execute(query2,drawSelected);
                              //Funcion para dibujar la feature que nos devuelve la query
                              function drawSelected(fs){
                                      var featureSelected = fs.features[0];
                                      var rutaGraphic = new Graphic(featureSelected.geometry,sls,featureSelected.attributes,infoTemplate);
                                      mapa.graphics.add(rutaGraphic);
                                      console.log(rutaGraphic);
                              };
                      };
       },

       //Funcion que se ejecutara al clicar sobre el boton de consulta
      funcionConsulta:function(){
              //Borramos los elementos existentes de la tabla
              var node = document.getElementById('rutasUsers');
              while (node.hasChildNodes()) {
                  node.removeChild(node.firstChild);
              };
              //Definimos la query segun los parametros que le pasemos a traves de las funciones definidas despues
              var query = new Query();
              query.where =this.dificultad +" AND " + this.distancia + " AND " + this.tiempo;
              query.outFields = ["NombreRuta","Usuario","Dificultad","Minutos","Segundos","SHAPE.STLength()","OBJECTID"];
              query.returnGeometry = true;
              var queryTask = new QueryTask('http://localhost:6080/arcgis/rest/services/Proyecto/ShareRoutes/MapServer/0');
              //Al ejecutarla llamamos a las funciones definidas anteriormente para rellenar la tabla con la información de las rutas 
              //y que al clicar en cada una nos la dibuje en el mapa
              queryTask.execute(query,addColumns2);

      },
      //Funciones que definen el parámetro dificultad de la query
      funcionFacil:function(){
          this.dificultad ="Dificultad=1";
      },
      funcionMedia:function(){
          this.dificultad ="Dificultad=2";
      },
      funcionTrialera:function(){
          this.dificultad ="Dificultad=3";
      },
      funcionTodasDificul:function(){
          this.dificultad= "1=1";
      },


      //Funciones que definen el parámetro distancia de la query
      funcion5km:function(){
          this.distancia ="SHAPE.STLength()<5000";
      },
      funcion10km:function(){
          this.distancia ="SHAPE.STLength()>=5000 AND SHAPE.STLength()<10000";
      },
      funcionMas10km:function(){
          this.distancia ="SHAPE.STLength()>=10000";
      },
      funcionTodasDist:function(){
          this.distancia= "1=1";
      },


      //Funciones que definen el parámetro tiempo de la query
      funcion15Min:function(){
          this.tiempo ="Minutos<15";
      },
      funcion30Min:function(){
          this.tiempo ="Minutos>=15 AND Minutos<30";
      },
      funcionMas30Min:function(){
          this.tiempo ="Minutos>=30";
      },
      funcionTodasMin:function(){
          this.tiempo= "1=1";
      },

      //Establecemos que al cerrar el widget se borre la capa de graficos y los parametros dela query vuelvan a los vamores por defecto
       onClose: function(){
          this.map.graphics.clear();
         console.log('onClose');
         this.dificultad= "1=1";
         this.distancia= "1=1";
         this.tiempo= "1=1";
       },
    });
  });