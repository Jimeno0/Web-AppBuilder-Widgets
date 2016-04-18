define(['dojo/_base/declare',
  'jimu/BaseWidget',
  'esri/geometry/Point',
  'esri/layers/GraphicsLayer',
  'esri/graphic',
  'esri/symbols/PictureMarkerSymbol',
  'esri/tasks/Geoprocessor',
  'esri/tasks/FeatureSet',
  'esri/symbols/SimpleLineSymbol',
  'esri/Color',
  'esri/geometry/Polyline',
  'dojo/_base/lang',
  'esri/InfoTemplate',
  'esri/dijit/InfoWindowLite',
  'dojo/dom-construct',
  'bootstrap/Dropdown',
  'bootstrap/Tab',
  'bootstrap/Modal'
 ],
  function(declare, BaseWidget,Point,GraphicsLayer,Graphic,PictureMarkerSymbol,
    Geoprocessor,FeatureSet,SimpleLineSymbol,Color,
     Polyline,lang,InfoTemplate,InfoWindowLite,domConstruct) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {
      // Custom widget code goes here


      //Propiedades:
      baseClass: 'jimu-widget-customwidget',
      tipoPunto: null,
      tipoPOIs: null,
      graphicPuntos:null,
      graphicPOIs:null,
      tipoRutaParam: "Bicicleta",
      pInicioSymbol:null,
      poisSymbol:null,
      //Metodos:
      DrawPoints:null,



      startup: function() {
          this.inherited(arguments);
          //Creamos las capas que contendran los graficos empleados en nuestro geoproceso, puntos de incio y resultados
          this.graphicPuntos = new GraphicsLayer();
          this.graphicPOIs = new GraphicsLayer();
          //Añadimos las capas al mapa
          this.map.addLayer(this.graphicPuntos);
          this.map.addLayer(this.graphicPOIs);
          //Definimos la simbología de nuestros puntos y les establecemos un offset en Y para que la punta de la flecha
          //coincida con el lugar donde hagamos click
          this.pInicioSymbol = new PictureMarkerSymbol('http://esri.github.io/quickstart-map-js/images/blue-pin.png',20,35);
          this.pInicioSymbol.yoffset = 17;
          this.poisSymbol = new PictureMarkerSymbol('http://desarrolladores.esri.es/wp-content/uploads/images/ArcGIS%20PIN%20ICON.png', 20, 35);
          this.poisSymbol.yoffset = 17;


      },

      onOpen: function(){
          //Creamos el infowindow que queremos y que rellenaremos mas adelante segun definamos el info template
          //Lo aplicamos al mapa y le damos el tamaño que queremos
          var infoWindow = new InfoWindowLite(null, domConstruct.create("div", null, null, this.map.root));
          infoWindow.startup();
          this.map.setInfoWindow(infoWindow);
          this.map.infoWindow.resize(200, 100);
        //Definimos la funcion para el metodo DrawPoints
          this.DrawPoints = this.map.on("click",lang.hitch(this,clickPuntos));
          function clickPuntos(e){
                  if (this.tipoPunto == "puntoIni") {
                        puntoInicio = e.mapPoint;
                        //Creamos el grafico a partir de la geometria anterior, le pasamos una simbologia
                        //y la añadimos a la capa grafica correspondiente
                        var inicioGraphic = new Graphic(puntoInicio,this.pInicioSymbol);
                        this.graphicPuntos.add(inicioGraphic);
                        //Creamos un featureSet y le pasamos el grafico para que sirva de parametro de entrada
                        //En nuestro geoproceso
                        var feature1 = [];
                        feature1.push(inicioGraphic);
                        featureSetInicio = new FeatureSet();
                        featureSetInicio.features = feature1;
                  };
          };
      },
      //Establecemos la propiedad TipoPunto =null para que no dibuje cuando cerramos el widget
      onClose: function(){
          this.tipoPunto = null;
          this.graphicPuntos.clear();
          this.graphicPOIs.clear();
       },

      //Funciones para definir el parametro de tipo de ruta
      funcionParamBici:function(){
          this.tipoRutaParam = "Bicicleta";
      },
      funcionParamRun:function(){
          this.trafficRadio.checked = false;
          this.tipoRutaParam = "Run";
      },
      funcionParamPaseo:function(){
          this.trafficRadio.checked = false;
          this.tipoRutaParam = "Andando";
      },

      //funciones para definir el tipo de punto
      funcionCapaInicio:function(){
          this.tipoPunto = "puntoIni";
      },

      //Funciones que definenen el parametro tipo POIs 
      funcionFuente:function(){
          this.tipoPOIs = "Fuente";
      },
      funcionResta:function(){
          this.tipoPOIs = "restauracion";
      },
      funcionMirador:function(){
          this.tipoPOIs = "Mirador";
      },
      funcionCerro:function(){
          this.tipoPOIs = "Peak";
      },
      funcionTransporte:function(){
          this.tipoPOIs = "Bus";
      },


      //Funciones para borrar los puntos de localización de la capa grafica
      funcionBorrar:function(){
          this.inherited(arguments);
          this.graphicPuntos.clear();
      },
      //
      funcionCalcular:function(){
          this.tipoPunto = null;
          var graphicPOIs = this.graphicPOIs;
          var tipoPOIs = this.tipoPOIs;
          var pictureMarkerSymbol = this.poisSymbol;
          var minutos = parseFloat(tiempoInput.value);
          var graphicPOIs = this.graphicPOIs;
          var mapa = this.map;
          //Borramos la ruta ya que calcularemos otra
          this.graphicPOIs.clear();
          //En caso de estar marcado el checkbutton haremos otro tipo de ruta
          var radio = this.trafficRadio.checked;
          if (radio == true) {
                    this.tipoRutaParam = "BiciSinTrafico";
          };
          //Definimos los parametros de entrada             
          var inputParameters = {
                "TipoViaje": this.tipoRutaParam,
                "BreakMin" : minutos,
                "Localizacion": featureSetInicio,
                "TipoPois":this.tipoPOIs,            
          };

          //Url del geoproceso
          var GProutesUrl = 
          "http://localhost:6080/arcgis/rest/services/Proyecto/CalculoPOIsAreaServ/GPServer/Calculo%20de%20POIs%20en%20Area%20Servicio";
          //Establecemos el geoproceso, el sistema de referencia de salida para que nos lo pinte bien y realizamos el submitjob
          var gp = new Geoprocessor(GProutesUrl);
          gp.setOutSpatialReference( {wkid: 102100});
          gp.submitJob(inputParameters,callBack);

          function callBack(results){
                gp.getResultData(results.jobId,"RutaSalida",resultsCallback);
                //CallBack del resultData
                function resultsCallback(featuresPOIs ){

                //Creamos y establecemos lo que aparecerá en nuestro infotemplate
                infoTemplate = new InfoTemplate();
                infoTemplate.setTitle("<strong>Información</strong>");
                infoTemplate.setContent("hello");
                infoTemplate.setContent(getTextContent);

                      //Función que define el contenido de nuestro info template
                      function getTextContent(graphic){

                                //Estructura de control de flujo para controlar el atributo de nombre que aparecerá 
                                //en el info template, en caso de ser nulo o estar vacio que no aparezca en el info Template
                                if (!!graphic.attributes.name) {
                                    if (graphic.attributes.name == " ") {
                                      var placeNameTemplate = "";
                                    }else{
                                    var placeNameTemplate = "<br><b>Nombre:</b> "+ graphic.attributes.name;
                                    };
                                }else {
                                  var placeNameTemplate = "";
                                };
                                //Definimos las variables de distancia y tiempo que aparecerán en el info template
                                var tipoAttr = graphic.attributes.TIPO;
                                return "<b>Tipo:</b> " + tipoAttr + placeNameTemplate ;
                      };

                      var features = featuresPOIs.value.features;
                      //Bucle for que recorrera todas las entidades de nuestra features, aplicandoles una simbologia y añadiendolas a la capa grafica.
                      for (var i = 0; i < features.length; i++) {
                        
                        features[i].symbol = pictureMarkerSymbol;
                        features[i].infoTemplate = infoTemplate;
                        graphicPOIs.add(features[i]);
                      };
                };
          };
      },

    });
  });