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
    "dojo/query",
    'dojo/dom',
    'dojo/on', 
    'dijit/form/ValidationTextBox',
    'dijit/form/NumberTextBox',
    'dijit/form/TextBox',
    'dijit/form/CheckBox'
  ],
  function(
    declare,
    _WidgetsInTemplateMixin,
    BaseWidgetSetting,request,domConstruct,query,dom,on) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      // Declaramos la clase CSS para los estilos
      baseClass: 'jimu-widget-in-panel-setting',
      _algo:{},

      startup: function() {
        this.inherited(arguments);
        var config = this.config;

        // if config doesnt exisist we create it
        config.inPanelVar = config.inPanelVar || {}
        config.inPanelVar.params = config.inPanelVar.params || {}

        this.setConfig(this.config);
      },

      // Al abrir la configuración del widget
      setConfig: function(config) {
        this.config = config;
        var options = config.inPanelVar.params;

        // Load service URL if exisits
        if (options && options.urlServicio) {
            this.urlServicio.set('value', options.urlServicio);
        };
        return this.config;
      },

      // On close widget config
      getConfig: function() {


        var options = this.config.inPanelVar.params;
        options.urlServicio = this.urlServicio.get("value");
        options.tableConfigParams = new Array();
        options.queryConfigParams = new Array();

        // Almacenamos los valores de titulo y contenido de cada columna de la tabla
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



        //Almacenamos los valores de los botones
        for (i = 0; i < document.getElementById("querySettings").children.length; i++) {

          var rowParams = document.getElementById("querySettings").children[i];
          var rowHeaderChild = rowParams.children[1];
          var headerName = rowHeaderChild.children[0].value;
          var  queryliParams = new Array();

          //recorremos la tabla dentro de cada row para extraer los valores
          for (n = 0; n < rowParams.children[4].children[0].children.length; n++) {
            var rowLi = rowParams.children[4].children[0].children[n];
            var rowNameli = rowLi.children[1].children[0].value;
            var rowQuery = rowLi.children[3].children[0].value;
            queryliParams[n] = {
              liName:rowNameli,
              query:rowQuery
            };
          };
          queryParams[i] = {
            buttonName:headerName,
            arrayTest:queryliParams
          };
          options.queryConfigParams[i] = queryParams[i];
        };
        return this.config;
      },
      comprobarUrl: function(){
        tableParams = new Array();
        queryParams = new Array();
        var urlJson = this.urlServicio.value+"?f=json";
        fields = this._algo.fields;
        this._algo.counter = 0;
        this._algo.counterQMenu = 0;
        this._algo.counterQli = 0;

        var that = this;

        funciBorrarRow = function(counter){
          var parentId = counter.parentElement.getAttribute('id');
          document.getElementById(parentId).removeChild(counter);
        };

        functDeleteRow = function(){
          this.parentElement.parentElement.remove();
        };
            
        funciAddQueryLiOld = function(counter){
          var parentTable = document.getElementById("idTableli"+counter);
          var idElemento = "idQli"+that._algo.counterQli;
          var tr = domConstruct.create("tr",{id:idElemento}),
          td = domConstruct.create("td", {}, tr),
          l = domConstruct.create("span", {innerHTML:"Nombre de consulta:"}, td, 'first'),
          td1 = domConstruct.create("td", {}, tr),
          l1 = domConstruct.create("input", {}, td1, 'first'),
          td11 = domConstruct.create("td", {}, tr),
          l11 = domConstruct.create("span", {innerHTML:"introduzca query:"}, td11, 'first');
          td12 = domConstruct.create("td", {}, tr),
          l12 = domConstruct.create("input", {}, td12, 'first');
          td13 = domConstruct.create("td", {}, tr),
          l13 = domConstruct.create("button", {
                  innerHTML:"Delete",
                  style: { "background-color": "red" },
                  'onClick' : "funciBorrarRow("+idElemento+");"
                }, td13, 'first');
          parentTable.appendChild(tr);
          that._algo.counterQli++;
        };


        funciAddQueryLi = function(){
          var querysTable = this.parentElement.parentElement.children[4].children[0];
          var idElemento = "idQli"+that._algo.counterQli;

          var row = domConstruct.toDom('<tr id="'+idElemento+'">\
                                          <td>\
                                            Query name:\
                                          </td>\
                                          <td>\
                                            <input>\
                                          </td>\
                                          <td>\
                                            Insert query:\
                                          </td>\
                                          <td>\
                                            <input>\
                                          </td>\
                                          <td class="btnDeleteClass">\
                                          </td>\
                                        </tr>'); 

        var nl = query(".btnDeleteClass",row);
        var btnDelete =  domConstruct.toDom("<button>\
                                               Delete\
                                             </button>");

        on(btnDelete, "click", functDeleteRow);


          querysTable.appendChild(row);
          nl[0].appendChild(btnDelete);

          that._algo.counterQli++;
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
        var idElemento = "id"+this._algo.counter;
        var slectId = "select"+this._algo.counter;

        var row = domConstruct.toDom('<tr id="'+idElemento+'">\
                                        <td>\
                                          Column header:\
                                        </td>\
                                        <td>\
                                          <input>\
                                        </td>\
                                        <td>\
                                          Column header:\
                                        </td>\
                                        <td>\
                                          <select class="selectClass">\
                                          </select>\
                                        </td>\
                                        <td class="btnDeleteClass">\
                                        </td>\
                                      </tr>'); 

            var nl2 = query(".selectClass",row);

            for (i = 0; i < this._algo.fields.length; i++) { 
              var fieldOption =  domConstruct.toDom("<option>\
                                                       "+this._algo.fields[i].name+"\
                                                     </option>");
              nl2[0].appendChild(fieldOption);
            };



                    // var node = dom.byId(idElemento);
        var nl = query(".btnDeleteClass",row);
        var btnDelete =  domConstruct.toDom("<button>\
                                               Delete\
                                             </button>");

        on(btnDelete, "click", functDeleteRow);


        this._algo.counterQMenu++;

        document.getElementById("columnsSettings").appendChild(row);
        nl[0].appendChild(btnDelete);


      },

      funciAddQueryMenu: function(){

        var idElemento = "idQ"+this._algo.counterQMenu;




        var row = domConstruct.toDom('<tr id="'+idElemento+'">\
                                        <td>\
                                          Dropdown button name:\
                                        </td>\
                                        <td>\
                                          <input>\
                                        </td>\
                                        <td class="btnDeleteClass">\
                                        </td>\
                                        <td class="btnAddQueryClass">\
                                        </td>\
                                        <td>\
                                          <table style="border:1px solid #000;">\
                                          </table>\
                                        </td>\
                                      </tr>');                                     
                                      
        // var node = dom.byId(idElemento);
        var nl = query(".btnDeleteClass",row);
        var nl2 = query(".btnAddQueryClass",row);
        var btnDelete =  domConstruct.toDom("<button>\
                                               Delete\
                                             </button>");
        var btnAddQuery =  domConstruct.toDom("<button>\
                                               Add query element\
                                             </button>"); 

        on(btnDelete, "click", functDeleteRow);
        on(btnAddQuery, "click", funciAddQueryLi);


        this._algo.counterQMenu++;

        document.getElementById("querySettings").appendChild(row);
        nl[0].appendChild(btnDelete);
        nl2[0].appendChild(btnAddQuery);



      }
    });
  });

