///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////
define([
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'jimu/BaseWidgetSetting',
    "dojo/request",
    "dojo/dom-construct",
    'dijit/form/ValidationTextBox',
    'dijit/form/NumberTextBox',
    'dijit/form/TextBox',
    'dijit/form/CheckBox'
  ],
  function(
    declare,
    _WidgetsInTemplateMixin,
    BaseWidgetSetting,request,domConstruct) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      // Declaramos la clase CSS para los estilos
      baseClass: 'jimu-widget-in-panel-setting',
      _algo:{},

      startup: function() {
        this.inherited(arguments);
        var config = this.config;

        // Si no existe la configuración, la creamos
        config.inPanelVar = config.inPanelVar || {}
        config.inPanelVar.params = config.inPanelVar.params || {}

        this.setConfig(this.config);
      },

      // Al abrir la configuración del widget
      setConfig: function(config) {
        this.config = config;
        var options = config.inPanelVar.params;

        // Cargamos los valores si existen
        if (options && options.urlServicio) {
            this.urlServicio.set('value', options.urlServicio);
        };

        tableParams = new Array();

        for (i = 0; i < document.getElementById("columnsSettings").children.length; i++) { 
   
          var rowParams = document.getElementById("columnsSettings").children[i];
          var rowHeaderChild = rowParams.children[1];
          var rowFieldChild = rowParams.children[3];
          var headerName = rowHeaderChild.children[0].value;
          var fieldName = rowFieldChild.children[0].value;
          tableParams[i] = {
            header:headerName,
            fieldName:fieldName
          };

          // if (options && options.tableParams && options.tableParams[i]) {
          //   this.headerParams[i].set('value', options.headerParams[i]);

          // };
          // if (options && options.fieldsParams[i]) {
          //   this.fieldsParams[i].set('value', options.fieldsParams[i]);

          // };
        };




      },

      // Al cerrar la configuración del widget
      getConfig: function() {
        debugger
        var options = this.config.inPanelVar.params;
        options.urlServicio = this.urlServicio.get("value");
        options.tableConfigParams = new Array();
        // Almacenamos los valores
        for (i = 0; i < document.getElementById("columnsSettings").children.length; i++) {
          var rowParams = document.getElementById("columnsSettings").children[i];
          var rowHeaderChild = rowParams.children[1];
          var rowFieldChild = rowParams.children[3];
          var headerName = rowHeaderChild.children[0].value;
          var fieldName = rowFieldChild.children[0].value;
          tableParams[i] = {
            header:headerName,
            fieldName:fieldName
          };


        options.tableConfigParams[i] = tableParams[i];
         };
        return this.config;
      },

      comprobarUrl: function(){

        var urlJson = this.urlServicio.value+"?f=json";
        fields = this._algo.fields;
        this._algo.counter = 0;
        var that = this;

        funciBorrarRow = function(counter){
          var elemtToDelete = document.getElementById("id"+counter);
          document.getElementById("columnsSettings").removeChild(elemtToDelete);
        };
        request(urlJson, {
          headers: {
            "X-Requested-With": null
          }
        }).then(
          function(text){
            var jsonObjet = JSON.parse(text);
           that._algo.fields = jsonObjet.fields;
           that.funciAddRow();
            
          },
          function(error){
            console.log("An error occurred: " + error);
          }
        );
      },
      funciAddRow: function(){
        //document.getElementById("columnsSettings").innerHTML ='<tr><td>....</td></tr>'
         var tr = domConstruct.create("tr",{id:"id"+this._algo.counter}),
            td = domConstruct.create("td", {}, tr),
            l = domConstruct.create("span", {innerHTML:"Encabezado: "}, td, 'first'),
            td1 = domConstruct.create("td", {}, tr),
            l1 = domConstruct.create("input", {id:"input"+this._algo.counter}, td1, 'first'),
            td11 = domConstruct.create("td", {}, tr),
            l11 = domConstruct.create("span", {innerHTML:"Seleccione campo:"}, td11, 'first'),
            td12 = domConstruct.create("td", {}, tr),
            l12 = domConstruct.create("select", {id:"select"+this._algo.counter}, td12, 'first');

            for (i = 0; i < this._algo.fields.length; i++) { 
                var elemento = "l12"+i.toString(); 
                elemento = domConstruct.create("option", {innerHTML:this._algo.fields[i].name}, l12, 'first');
            };
            td13 = domConstruct.create("td", {}, tr),
            l13 = domConstruct.create("button", {
                  innerHTML:"X",
                  style: { "background-color": "red" },
                  'onClick' : "funciBorrarRow("+this._algo.counter+");"
                }, td13, 'first');

            this._algo.counter++;

            document.getElementById("columnsSettings").appendChild(tr);
      }

    });
  });

//document.getElementById("columnsSettings").children[0]