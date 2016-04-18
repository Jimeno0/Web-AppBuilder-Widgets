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
    'dijit/form/ValidationTextBox',
    'dijit/form/NumberTextBox',
    'dijit/form/TextBox',
    'dijit/form/CheckBox'
  ],
  function(
    declare,
    _WidgetsInTemplateMixin,
    BaseWidgetSetting) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      // Declaramos la clase CSS para los estilos
      baseClass: 'jimu-widget-in-panel-setting',

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
        }
        if (options && options.label1row) {
          this.label1row.set('value', options.label1row);
        }
        if (options && options.label2row) {
          this.label2row.set('value', options.label2row);
        }
        if (options && options.label3row) {
          this.label3row.set('value', options.label3row);
        }
        if (options && options.label4row) {
          this.label4row.set('value', options.label4row);
        }
        if (options && options.label5row) {
          this.label5row.set('value', options.label5row);
        }



        if (options && options.firstRowName) {
          this.firstRowName.set('value', options.firstRowName);
        }
        if (options && options.secondRowName) {
          this.secondRowName.set('value', options.secondRowName);
        }
        if (options && options.thirdRowName) {
          this.thirdRowName.set('value', options.thirdRowName);
        }
        if (options && options.fourthRowName) {
          this.fourthRowName.set('value', options.fourthRowName);
        }
        if (options && options.fifthRowName) {
          this.fifthRowName.set('value', options.fifthRowName);
        }


      },

      // Al cerrar la configuración del widget
      getConfig: function() {
        var options = this.config.inPanelVar.params;

        // Almacenamos los valores
        options.urlServicio = this.urlServicio.get("value");

        options.label1row = this.label1row.get("value");
        options.label2row = this.label2row.get("value");
        options.label3row = this.label3row.get("value");
        options.label4row = this.label4row.get("value");
        options.label5row = this.label5row.get("value");

        options.firstRowName = this.firstRowName.get("value");
        options.secondRowName = this.secondRowName.get("value");
        options.thirdRowName = this.thirdRowName.get("value");
        options.fourthRowName = this.fourthRowName.get("value");
        options.fifthRowName = this.fifthRowName.get("value");
        return this.config;
      }

    });
  });
