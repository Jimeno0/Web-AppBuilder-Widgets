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
      graphicPuntos:null,
      graphicPOIs:null,
      tipoRutaParam: "Bicicleta",
      pInicioSymbol:null,
      poisSymbol:null,
      //Metodos:
      DrawPoints:null,



      startup: function() {
          this.inherited(arguments);
          //Creamos las capas que contendran los graficos empleados en nuestro geoproceso, puntos de incio y fin y polilinea para la ruta
          this.graphicPuntos = new GraphicsLayer();
          this.graphicPOIs = new GraphicsLayer();
          //Añadimos las capas al mapa
          this.map.addLayer(this.graphicPuntos);
          this.map.addLayer(this.graphicPOIs);
          //Definimos la simbología de nuestros puntos y les establecemos un offset en Y para que la punta de la flecha
          //coincida con el lugar donde hagamos click
          this.pInicioSymbol = new PictureMarkerSymbol('http://esri.github.io/quickstart-map-js/images/blue-pin.png',20,35);
          this.pInicioSymbol.yoffset = 17;
          // this.poisSymbol = new PictureMarkerSymbol('http://desarrolladores.esri.es/wp-content/uploads/images/ArcGIS%20PIN%20ICON.png', 20, 35);
          // this.poisSymbol.yoffset = 17;
          //Creamos el infowindow que queremos y que rellenaremos mas adelante segun definamos el info template
          //Lo aplicamos al mapa y le damos el tamaño que queremos
          var infoWindow = new InfoWindowLite(null, domConstruct.create("div", null, null, this.map.root));
          infoWindow.startup();
          this.map.setInfoWindow(infoWindow);
          this.map.infoWindow.resize(200, 200);

      },

       onOpen: function(){
        //Definimos la funcion para el metodo DrawPoints
        this.DrawPoints = this.map.on("click",lang.hitch(this,clickPuntos))

             function clickPuntos(e){
                  //Segun el parametro de entrada sera de punto de inicio o de final
          //         if (this.tipoPunto == "puntoIni") {
          //               //Extraemos la geometria del lugar donde hemos clickado
          //               puntoInicio = e.mapPoint;
          //               //Creamos el grafico a partir de la geometria anterior, le pasamos una simbologia
          //               //y la añadimos a la capa grafica correspondiente
          //               var inicioGraphic = new Graphic(puntoInicio,this.pInicioSymbol);
          //               this.graphicPuntos.add(inicioGraphic);
          //               //Creamos un featureSet y le pasamos el grafico para que sirva de parametro de entrada
          //               //En nuestro geoproceso
          //               var feature1 = [];
          //               feature1.push(inicioGraphic);
          //               featureSetInicio = new FeatureSet();
          //               featureSetInicio.features = feature1;
                                         




          //                                 }else if(this.tipoPunto == "puntoFini") {
          //               puntoFinal = e.mapPoint;
          //               var finGraphic = new Graphic(puntoFinal,this.poisSymbol);
          //               this.graphicPOIs.add(finGraphic);
          //               var feature2 = [];
          //               feature2.push(finGraphic);
          //               featureSetFin = new FeatureSet();
          //               featureSetFin.features = feature2;
          //               };
          //   };
          // //Aplicamos el metodo anterior
          // this.DrawPoints;
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


      //Funciones para borrar los puntos de inicio de la capa grafica
      funcionBorrar:function(){
          this.inherited(arguments);
          this.graphicPuntos.clear();
      },



      //
      // funcionCalcular:function(){

      //             var graphicPOIs = this.graphicPOIs;
      //             var mapa = this.map;
      //             //Borramos la ruta ya que calcularemos otra
      //             this.graphicPOIs.clear();
      //             //En caso de estar marcado el checkbutton haremos otro tipo de ruta
      //             var radio = this.trafficRadio.checked;
      //             if (radio == true) {
      //                       this.tipoRutaParam = "BiciSinTrafico";
      //             };
      //             //Definimos los parametros de entrada             
      //             var inputParameters = {
      //                   "TipoRuta": this.tipoRutaParam,
      //                   "PuntoInicio": featureSetInicio
                        
      //             };
      //             //Url del geoproceso
      //             var GProutesUrl = 
      //             "http://localhost:6080/arcgis/rest/services/Proyecto/CalculoPOIsAreaServ/GPServer/Calculo%20de%20POIs%20en%20Area%20Servicio";
      //             //Establecemos el geoproceso, el sistema de referencia de salida para que nos lo pinte bien y realizamos el submitjob
      //             var gp = new Geoprocessor(GProutesUrl);
      //             gp.setOutSpatialReference( {wkid: 102100});
      //             gp.submitJob(inputParameters,callBack);
      //             //Funcion de callback
      //             function callBack(results){ 

      //                   //Metodo getResultsData para obtener los resultados
      //                   gp.getResultData(results.jobId,"Ruta",resultsCallback);
      //                   //CallBack del resultData
      //                   function resultsCallback(featureRuta){
      //                           //Introducimos en una variable
      //                           ruta = featureRuta.value.features[0];
      //                           //Simbologia de la ruta
      //                           this.poisSymbol = new PictureMarkerSymbol(
      //                             'http://desarrolladores.esri.es/wp-content/uploads/images/ArcGIS%20PIN%20ICON.png', 20, 35);
      //                           this.poisSymbol.yoffset = 17;
      //                           //Creamos y establecemos lo que aparecerá en nuestro infotemplate
      //                           infoTemplate = new InfoTemplate();
      //                           infoTemplate.setTitle("Información de ruta");
      //                           infoTemplate.setContent("hello");
      //                           infoTemplate.setContent(getTextContent);

      //                                 //Función que define el contenido de nuestro info template
      //                                 function getTextContent(graphic){

      //                                           //Estructura de control de flujo para controlar el atributo de tiempo que aparecerá 
      //                                           //en el info template, en función del tipo de ruta
      //                                           if (graphic.attributes.Total_SegundosBici != undefined) {
      //                                             var totalSegundos = graphic.attributes.Total_SegundosBici;
      //                                           }else if (graphic.attributes.Total_SegundosRun != undefined) {
      //                                             var totalSegundos = graphic.attributes.Total_SegundosRun;
      //                                           }else if (graphic.attributes.Total_SegundosAndando != undefined) {
      //                                             var totalSegundos = graphic.attributes.Total_SegundosAndando;
      //                                           };

      //                                           //Definimos las variables de distancia y tiempo que aparecerán en el info template
      //                                           var longitud = Math.round(graphic.attributes.Total_Length);
      //                                           var minutosDecimales = totalSegundos/60;
      //                                           var minutos = parseInt(minutosDecimales);
      //                                           var segundos = Math.round((minutosDecimales - minutos)*60); 

      //                                           //Definimos la cadena de texto y variables que nos devuelve la función
      //                                           return "Distancia: " + longitud + " m <br> Tiempo: " + minutos + "'  " + segundos + "''";
      //                                 };
      //                           //Establecemos la extension del mapa en funcion de la ruta
      //                           mapa.setExtent(ruta.geometry.getExtent());
      //                           var rutaGraphic = new Graphic(ruta.geometry,sls,ruta.attributes,infoTemplate);
      //                           graphicPOIs.add(rutaGraphic);                                     
      //                   };
      //             };   
      // },
      //Establecemos la propiedad TipoPunto =null para que no dibuje cuando cerramos el widget
       onClose: function(){
          this.tipoPunto = null;
       },
    });
  });