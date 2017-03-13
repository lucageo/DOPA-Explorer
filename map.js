

(function($) {
 $(document).bind('leaflet.map', function(e, map, lMap)
   {
     lMap.spin(true);
    // lMap.scrollWheelZoom.disable();
//---------------------------------------------------------------
// BASIC SETUP
//---------------------------------------------------------------
   // create fullscreen control
   var fsControl = new L.Control.FullScreen();
   // add fullscreen control to the lMap
   lMap.addControl(fsControl);
   // detect fullscreen toggling
   lMap.on('enterFullscreen', function(){
     if(window.console) window.console.log('enterFullscreen');
   });
   lMap.on('exitFullscreen', function(){
     if(window.console) window.console.log('exitFullscreen');
   });
   L.control.navbar().addTo(lMap);
   var zoomBox = L.control.zoomBox({
       modal: false,  			// If false (default), it deactivates after each use.
    });
    lMap.addControl(zoomBox);
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// BASE LAYERS
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     var mbAttr = '', mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw';
     var grayscale  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr});
     var grayscale2   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr});//.addTo(lMap);
     var streets  = L.tileLayer('https://api.mapbox.com/styles/v1/lucageo/ciywysi9f002e2snqsz0ukhz4/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibHVjYWdlbyIsImEiOiJjaXIwY2FmNHAwMDZ1aTVubmhuMDYyMmtjIn0.1jWhLwVzKS6k1Ldn-bVQPg').addTo(lMap);

     lMap.setView([20, 0], 3); //set lat long and zoom level
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// COUNTRY LAYER - CARTODB
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//COUNTRY LAYER GEOJSON - POPUP AND INFO
//--------------------------------------------------------------------------------------------------------------------

   function pop_country_layer(feature, layer) {

   var Popup_Content_Country = '<center><i class="fa fa-globe fa-4x" aria-hidden="true"></i><hr><a href="/country/'+feature.properties.iso_2digit+'">'+feature.properties.co_name+'</a></center><br>&nbsp;&nbsp;&nbsp; Number of PA <b>&nbsp;&nbsp;&nbsp;'+feature.properties.count_vals+'</b><hr></i>&nbsp;&nbsp;&nbsp;PA Density <b>&nbsp;&nbsp;&nbsp;'+feature.properties.count_vals_density;

   var t_country = function()
   {
     return [	{
               name: 'Number of PAs',
               data: [parseFloat(Math.round(feature.properties.count_vals*100)/100)]
               },
               {
               name: 'PA Density',
               data: [parseFloat(feature.properties.count_vals_density*100)/100]
               }
             ]
     }

          layer.on('popupopen', function(e) {

            $('#container_country_data').highcharts({
              chart: {type:'bar', height: 300, width: 370},
              colors: ['#c9db72', '#5b8059'],
              title: {text: null},
              subtitle: {
                  text: 'COUNTRY PROTECTION'
              },
              credits: {
                  enabled: false,
                  text: null,
              },
       xAxis: {
              categories: ['%'],
              title: {
                  text: null
              }
          },
       yAxis: {
              min: 0,
              title: {
                  text: 'Aichi Target 11 Indexes',
                  align: 'high'
              },
              labels: {
                  overflow: 'justify'
              }
          },

              series: t_country(feature)

            });
             $('#container_country_name').html('<center><a href="/ecoregion/'+feature.properties.iso_2digit+'">'+feature.properties.co_name+'</a></center><hr>');
             $('#container_country_info').html('<hr><p>Country <b>'+feature.properties.co_name+'</b></p><hr>');
             $('#container_country_info2').html('<p>Country <b>'+feature.properties.co_name+'</b></p><hr>');
          });


      layer.on('popupclose', function(e){
        $('#container_country_data').html("");
      });
          layer.on({
               mouseover: highlightFeatureecor,
               mouseout: resetHighlightecor,
              'click': function (e) {
                    select(e.target);
                     }
                     });

   layer.bindPopup(Popup_Content_Country);

   }
//---------------------------------------------------------------
// CARTO COUNTRY Legend
//---------------------------------------------------------------
     function getColor(d) {
       return d > 500  ? '#126597' :
              d > 300   ? '#2E7AA7' :
              d > 200    ? '#4A8FB8' :
              d > 100    ? '#67A4C9' :
              d > 75    ? '#83B9D9' :
              d > 50     ? '#9FCEEA' :
              d > 10      ? '#BCE3FB' ://else
                                '#fff';
     }
    var legend = L.control({position: 'bottomleft'});
    legend.onAdd = function (lMap) {
        var div = L.DomUtil.create('div', 'info legend'),
         labels = ['<div id="countrylegend"><p>Country Protection</p></div>'],
           grades = [10, 50, 75, 100, 200, 300, 500],
           key_labels = [' 10 PA ',' 50 PA ',' 75 PA ',' 100 PA ',' 200 PA ',' 300 PA ',' 500 PA '];
               for (var i = 0; i < grades.length; i++) {
                div.innerHTML += labels.push('<i style="background:' + getColor(grades[i] + 1) + '"></i> ' + key_labels[i] + (key_labels[i + 1] ? '&ndash;' + key_labels[i + 1] + '<br>' : '+'));
               }
           div.innerHTML = labels.join('');
         return div;
      };
      legend.addTo(lMap);
 // style function for styling the GeoJSON layer, uses getColor function above
   var stylecou = function(feature) {
     return {
       fillColor: getColor(feature.properties.count_vals),
       weight: 1,
       opacity: 1,
       color: 'white',
       dashArray: '3',
       fillOpacity: 0.7,
       zIndex: 1
     }
   }
//---------------------------------------------------------------
// CARTO COUNTRY LAYER SETUP - highlight AND zoomToFeature
//---------------------------------------------------------------
    // function we can use to filter what data is added to the GeoJSON layer
     var filter = function(feature) {
       return feature.properties.cartodb_id > 0;

     }
     // function highlight
     function highlightFeature(e) {
       var layer = e.target;
       layer.setStyle({
         weight: 2,
         color: '#ffffff',
         dashArray: '',
         fillOpacity: 0.8
       });
      // info.update(layer.feature.properties);
     }
     // function reset highlight
     function resetHighlight(e) {
       Country_layer.resetStyle(e.target);
     }
     // function zoom to feature
     function zoomToFeature(e) {
       lMap.fitBounds(e.target.getBounds());
     }
 //---------------------------------------------------------------
 // CARTO COUNTRY LAYER
 //---------------------------------------------------------------
    var onEachFeature = function(feature, layer) {
           if (feature.properties) {

              pop_country_layer(feature, layer);

              layer.on({
                 mouseover: highlightFeature,
                 mouseout: resetHighlight,
                 'click': function (e) {
                       select(e.target);
                       $( "#block-block-136" ).show();
                       $('#print_btn_country').show();
                       $('#print_btn_ecoregion').hide();
                       $('#print_btn_reg').hide();
                       $('#print_btn').hide();

                   //zoomToFeatureeco(e);
                 }
              });
          }
      }

   var Country_layer = L.geoJson(null, {
     filter: filter,
     onEachFeature: onEachFeature,
     style: stylecou
   });//.addTo(lMap);
   var query = "SELECT * FROM world_country_prot";
   var sql = new cartodb.SQL({ user: 'climateadapttst' });
   sql.execute(query, null, { format: 'geojson' }).done(function(data) {//console.log(data);
      Country_layer.addData(data);
   });

//--------------------------------------------------------------------------------------------------------------------
// FUNCTION SELECT (TO SHOW THE GRAPH) OF THE region LAYER
//--------------------------------------------------------------------------------------------------------------------
  function select (layer) {
    if (selected !== null) {
        var previous = selected;
        }
    else {}
    selected = layer;
  }

  var selected = null;

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//  region LAYER GEOJSON - CARTODB
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// region LAYER GEOJSON - POPUP
//--------------------------------------------------------------------------------------------------------------------

    function pop_region_layer(feature, layer) {

    var popupContent1 = '<center><a href="/region/'+feature.properties.continent+'">'+feature.properties.continent+'</a></center><hr>';

    var t1=function()
    {
      return [	{
                name: 'Connectivity',
                data: [parseFloat(Math.round(feature.properties.connection*100)/100)]
                },
                {
                name: 'Protection',
                data: [parseFloat(Math.round(feature.properties.protection*100)/100)]
                }
              ]
      }

           layer.on('popupopen', function(e) {

             $('#container14').highcharts({
               chart: {type:'bar', height: 300, width: 370},
               colors: ['#c9db72', '#5b8059'],
               title: {text: null},
               subtitle: {
                   text: 'REGION PROTECTION CONNECTIVITY'
               },
               credits: {
                   enabled: false,
                   text: null,
                 //  href: 'http://ehabitat-wps.jrc.ec.europa.eu/dopa_explorer/?pa='+$paid
               },
        xAxis: {
               categories: ['%'],
               title: {
                   text: null
               }
           },
        yAxis: {
               min: 0,
               title: {
                   text: 'Aichi Target 11 Indexes',
                   align: 'high'
               },
               labels: {
                   overflow: 'justify'
               }
           },

               series: t1(feature)

             });
              $('#container15').html('<center><a href="/ecoregion/'+feature.properties.continent+'">'+feature.properties.continent+'</a></center><hr>');
              $('#container16').html('<hr><p>continet <b>'+feature.properties.continent+'</b></p><hr>');
              $('#container17').html('<p>continent <b>'+feature.properties.continent+'</b></p><hr>');
           });


       layer.on('popupclose', function(e){
         $('#container14').html("");
       });
           layer.on({
                mouseover: highlightFeatureecor,
                mouseout: resetHighlightecor,
               'click': function (e) {
                     select(e.target);
                      }
                      });

    layer.bindPopup(popupContent1);

    }
  //---------------------------------------------------------------
  // CARTO region Legend
  //---------------------------------------------------------------
        function getColorecor(dreg) {
          return dreg > 100       ? '#10732f' :
                 dreg > 75       ? '#1a9641' :
                 dreg > 50       ? '#a6d96a' :
                 dreg > 30       ? '#ffffbf' :
                 dreg > 20       ? '#fdae61' :
                 dreg > 5        ? '#e77f80' :
                 dreg > 0        ? '#ec3a3c' ://else
                                   '#ec3a3c';
        }
       var legendreg = L.control({position: 'bottomleft'});
       legendreg.onAdd = function (lMap) {
           var div = L.DomUtil.create('div', 'info legend'),
            labels = ['<div id="regionlegend"><p>Region Protection</p></div>'],
              gradregion = [0, 5, 20, 30, 50, 75, 100],
              key_labelsreg = [' 0% ',' 5% ',' 20% ',' 30% ',' 50% ',' 75%',' 100% '];
                  for (var iecor = 0; iecor < gradregion.length; iecor++) {
                   div.innerHTML += labels.push('<i style="background:' + getColorecor(gradregion[iecor ] + 1) + '"></i> ' + key_labelsreg[iecor] + (key_labelsreg[iecor+ 1] ? '&ndash;' + key_labelsreg[iecor + 1] + '<br>' : '+'));
                  }
              div.innerHTML = labels.join('');
            return div;
         };
         legendreg.addTo(lMap);
    // style function for styling the GeoJSON layer, uses getColorecor function above
      var styleecor = function(feature) {
        return {
          fillColor: getColorecor(feature.properties.protection),
          weight: 1,
          opacity: 1,
          color: getColorecor(feature.properties.protection),
          //dashArray: '3',
          fillOpacity: 0.6,
          zIndex: 1
        }
      }
  //---------------------------------------------------------------
  // CARTO region LAYER HIGHLIGHTS
  //---------------------------------------------------------------
       // function we can use to filter what data is added to the GeoJSON layer
        var filterecor = function(feature) {
          return feature.properties.protection > 0;
        }
        // function highlight
        function highlightFeatureecor(e) {
          var layer = e.target;
          layer.setStyle({
            weight: 2,
            color: '#ffffff',
            dashArray: '',
            fillOpacity: 0.8
          });
          //info.update(layer.feature.properties);
        }
        // function reset highlight
        function resetHighlightecor(e) {
          Region_layer.resetStyle(e.target);
        }
        // function zoom to feature
        function zoomToFeatureeco(e) {
          lMap.fitBounds(e.target.getBounds());
        }
  //---------------------------------------------------------------
  // CARTO region LAYER  -  SETUP
  //---------------------------------------------------------------
         var onEachFeatureecor = function(feature, layer) {
              if (feature.properties) {

                pop_region_layer(feature,layer);

                layer.on({
                     mouseover: highlightFeatureecor,
                     mouseout: resetHighlightecor,
                     'click': function (e) {
                           select(e.target);
                           $( "#block-block-135" ).show();
                           $('#print_btn_reg').show();
                           $('#print_btn_ecoregion').hide();
                           $('#print_btn_country').hide();
                           $('#print_btn').hide();

                       //zoomToFeatureeco(e);
                     }
                });
             }
         }

      var Region_layer = L.geoJson(null, {
      //  filter: filtereco,
        onEachFeature: onEachFeatureecor, pop_region_layer,
        style: styleecor
      });
      var queryecor = "SELECT * FROM regions";
      var sqlecor = new cartodb.SQL({ user: 'climateadapttst' });
      sqlecor.execute(queryecor, null, { format: 'geojson' }).done(function(dataecor) {//console.log(data);
         Region_layer.addData(dataecor);
      });
      //---------------------------------------------------------------
      // SEARCH region
      //--------------------------------------------------------------
            //  var searchregion = L.control.search({
            //  position:'topleft',
            //  layer: Region_layer,
            //  zoom:7,
            //  circleLocation: false,
            //  //eco_layer: eco_hi,
            //  textErr: 'Site not found',
            //  propertyName: 'continent',
            //  textPlaceholder: '   Region...               ',
            //  buildTip: function(text, val) {
            //  //var type = val.layer.feature.properties.ecoregion_id;
            //  return '<a href="#"><b>'+text+'</b></a>';
            //
            // }
            // }).addTo(lMap);
  //--------------------------------------------------------------------------------------------------------------------
  // FUNCTION SELECT (TO SHOW THE GRAPH) OF THE region LAYER
  //--------------------------------------------------------------------------------------------------------------------
    function select (layer) {
      if (selected !== null) {
          var previous = selected;
          }
      else {}
      selected = layer;
    }

    var selected = null;
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // ecoregion JSON point LAYER - cartodb
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // ecoregion JSON point CARTO LAYER + filter
    //---------------------------------------------------------------
       var filter_ecoregion = function(feature) {
         return feature.properties.ecoregion_id > 1;
       }
       var eco_group = new L.LayerGroup();
       var query5 = "SELECT * FROM terrestrial_ecoregion_centroids";
       var sql5 = new cartodb.SQL({ user: 'climateadapttst' });
       sql5.execute(query5, null, { format: 'geojson' }).done(function(data5) {
       // console.info(data4)
       eco_layer = L.geoJson(data5, {
                   filter: filter_ecoregion,
                    onEachFeature: function (feature, eco_layer) {
                      //NOTHING BEACUSE THE POPUP IS MANAGED BY THE WMS
                      },
                    pointToLayer: function (feature, latlng) {
                      var geojsonMarkerOptions = {
                      radius:0.01,
                      opacity: 0,
                      fillOpacity: 0
                      };
                      return L.circleMarker(latlng, geojsonMarkerOptions );
                    }
         })//.addTo(lMap);

       eco_group.addLayer(eco_layer);
          if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            //console.info(wdpa_layer)
       eco_layer.bringToFront();
       }

     })

        //---------------------------------------------------------------
        // SEARCH ecoregion
        //--------------------------------------------------------------
               var searcheco = L.control.search({
               position:'topleft',
               layer: eco_group,
               zoom:7,
               circleLocation: false,
               eco_layer: eco_hi,
               textErr: 'Site not found',
               propertyName: 'ecoregion_name',
               textPlaceholder: 'Ecoregion...               ',
               buildTip: function(text, val) {
               var type = val.layer.feature.properties.ecoregion_id;
               return '<a href="#" class="'+type+'"><b>'+text+'</b></a>';

              }
              }).addTo(lMap);
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// TERRESTRIAL ECOREGION LAYER GEOJSON - GEOSERVER
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//TERRESTRIAL ECOREGION LAYER GEOJSON - POPUP
//--------------------------------------------------------------------------------------------------------------------
   var url_ecoregion = 'http://h05-prod-vm11.jrc.it/geoserver/conservationmapping/wms';
   var ecoregion=L.tileLayer.wms(url_ecoregion, {
       layers: 'conservationmapping:ecoregion_protection_connection_dopa_explorer',
       transparent: true,
       format: 'image/png',
       opacity:'0.7',
       zIndex: 33
    });
//---------------------------------------------------------------
//  ecoregion LAYER - GET FEATUREINFO FUNCTION
//---------------------------------------------------------------

   function getFeatureInfoUrl_e(map, layer, latlng, params) {
     //console.log(layer.wmsParams.layers)
  if (layer.wmsParams.layers=="conservationmapping:ecoregion_protection_connection_dopa_explorer")
  {
       var point1 = map.latLngToContainerPoint(latlng, map.getZoom()),
           size1 = map.getSize(),
           bounds1 = map.getBounds(),
           sw1 = bounds1.getSouthWest(),
           ne1 = bounds1.getNorthEast();

       var defaultParams1 = {
           request: 'GetFeatureInfo',
           service: 'WMS',
           srs: 'EPSG:4326',
           styles: '',
           version: layer._wmsVersion,
           format: layer.options.format,
           bbox: bounds1.toBBoxString(),
           height: size1.y,
           width: size1.x,
           layers: layer.options.layers,
           info_format: 'text/javascript'
       };
//console.warn(defaultParams1);
       params = L.Util.extend(defaultParams1, params || {});

       params[params.version === '1.3.0' ? 'i' : 'x'] = point1.x;
       params[params.version === '1.3.0' ? 'j' : 'y'] = point1.y;

       return layer._url + L.Util.getParamString(params, layer._url, true);
   }
 }

   //---------------------------------------------------------------
   // ecoregion WMS LEGEND
   //---------------------------------------------------------------
   function getColoreco(deco) {
     return deco > 50       ? '#045275' :
            deco > 17       ? '#00718b' :
            deco > 12       ? '#089099' :
            deco > 8        ? '#46aea0' :
            deco > 5        ? '#7ccba2' :
            deco > 2        ? '#b7e6a5' :
            deco > 0        ? '#f7feae' ://else
                              '#f7feae';
   }
   var legendeco = L.control({position: 'bottomleft'});
   legendeco.onAdd = function (lMap) {
      var div = L.DomUtil.create('div', 'info legend'),
       labels = ['<div id="ecolegend"><p>Ecoregion Protection</p></div>'],
         gradeseco = [0, 2, 5, 8, 12, 17, 50],
         key_labelseco = [' 0% ',' 2% ',' 5% ',' 8% ',' 12% ',' 17%',' 50% '];
             for (var ieco = 0; ieco < gradeseco.length; ieco++) {
              div.innerHTML += labels.push('<i style="background:' + getColoreco(gradeseco[ieco ] + 1) + '"></i> ' + key_labelseco[ieco] + (key_labelseco[ieco + 1] ? '&ndash;' + key_labelseco[ieco + 1] + '<br>' : '+'));
             }
         div.innerHTML = labels.join('');
       return div;
    };
    legendeco.addTo(lMap);

   //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
   //  ecoregion HIGHLIGHT WMS SETUP
   //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

         var url_ecoregion = 'http://h05-prod-vm11.jrc.it/geoserver/conservationmapping/wms';
         var eco_hi=L.tileLayer.wms(url_ecoregion, {
             layers: 'conservationmapping:ecoregion_protection_connection_hi',
             transparent: true,
             format: 'image/png',
             opacity:'1',
             zIndex: 34 // Use zIndex to order the tileLayers within the tilePane. The higher number, the upper vertically.
          }).addTo(lMap);

          eco_hi.setParams({CQL_FILTER:"ecoregion_ LIKE ''"}); // GEOSERVER WMS FILTER


   //---------------------------------------------------------------
   // ONCLICK RESPONSE ON HIGLIGHTED WDPA
   //--------------------------------------------------------------
          function hi_highcharts_eco(info,latlng){
            //CREATE VARIABLES OF EACH COLUMN YOU WANT TO SHOW FROM THE ATTRIBUTE TABLE OF THE WDPA WMS - EACH VARIABLE NEED TO BE SET IN UNDER "getFeatureInfoUrl" FUNCTION
            var name=info['ecoregion_'];
            var ecoid=info['ecoregion0'];
            var biome=info['biome'];
            var realm=info['realm'];
            var connectivity=info['tojson_p_2'];
            var protection=info['tojson_p_3'];
                                                  //console.warn(name);
            //WDPA HIGLIGHTED POPUP
            var popupContenteco = '<center><a href="/ecoregion/'+ecoid+'">'+name+'</a></center><hr>';

            var popup_eco = L.popup()
                 .setLatLng([latlng.lat, latlng.lng])
                 .setContent(popupContenteco)
                 .openOn(lMap);

                 $('#container5').html('<center><a href="/ecoregion/'+ecoid+'">'+name+'</a></center><hr>');
                 $('#container6').html('<hr><p>BIOME <b>'+biome+'</b></p><hr>');
                 $('#container7').html('<p>REALM <b>'+realm+'</b></p><hr>');
                 // The protection gauge
                 $('#container4').highcharts ({

                         chart: {
                             type: 'solidgauge'
                         },

                         title: null,

                         pane: {
                             center: ['50%', '50%'],
                             size: '60%',
                             startAngle: -90,
                             endAngle: 90,
                             background: {
                                  backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#FAFAFA',
                                 innerRadius: '100%',
                                 outerRadius: '60%',
                                 shape: 'arc'
                             }
                         },

                            yAxis: {
                                min: 0,
                                max: 100,
                                  y: 20,
                                title: {
                                    text: 'Ecoregion Protection',
                                     y: -100
                                },

                                stops: [
                                    [0.0, '#f7feae'], // green
                                    [0.02, '#b7e6a5'], // yellow
                                    [0.05, '#7ccba2'], // red
                                    [0.08, '#46aea0'], // red
                                    [0.12, '#089099'], // red
                                    [0.17, '#00718b'], // red
                                    [0.5, '#045275'] // red

                                ],

                                lineWidth: 0,
                                minorTickInterval: null,
                                tickAmount:0,
                                labels: {
                                    y: 20
                                }
                            },

                            credits: {
                                enabled: false
                            },

                            plotOptions: {
                                solidgauge: {
                                    dataLabels: {
                                        y: 1,
                                        borderWidth: 0,
                                        useHTML: true
                                    }
                                }
                            },

                            series: [{
                                name: 'Protection',
                                data: [parseFloat(Math.round(protection*100)/100)],
                                dataLabels: {
                                  format: '<div style="text-align:center"><span style="font-size:20px;color:' +
                                          ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                                          '<span style="font-size:12px;color:silver">%</span></div>',
                                  y: -30
                                },
                                tooltip: {
                                    valueSuffix: ' %'
                                }
                            }]

                        });

                        // The connectivity gauge
                       $('#container24').highcharts ({

                         chart: {
                             type: 'solidgauge'
                         },

                         title: null,

                         pane: {
                             center: ['50%', '50%'],
                             size: '60%',
                             startAngle: -90,
                             endAngle: 90,
                             background: {
                                  backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#FAFAFA',
                                 innerRadius: '100%',
                                 outerRadius: '60%',
                                 shape: 'arc'
                             }
                         },

                            yAxis: {
                                min: 0,
                                max: 100,
                                  y: 20,
                                title: {
                                    text: 'Ecoregion Connectivity',
                                     y: -100
                                },

                                stops: [
                                    [0.0, '#f7feae'], // green
                                    [0.02, '#b7e6a5'], // yellow
                                    [0.05, '#7ccba2'], // red
                                    [0.08, '#46aea0'], // red
                                    [0.12, '#089099'], // red
                                    [0.17, '#00718b'], // red
                                    [0.5, '#045275'] // red

                                ],

                                lineWidth: 0,
                                minorTickInterval: null,
                                tickAmount:0,
                                labels: {
                                    y: 20
                                }
                            },

                            credits: {
                                enabled: false
                            },

                            plotOptions: {
                                solidgauge: {
                                    dataLabels: {
                                        y: 1,
                                        borderWidth: 0,
                                        useHTML: true
                                    }
                                }
                            },

                            series: [{
                                name: 'Protection',
                                data: [parseFloat(Math.round(connectivity*100)/100)],
                                dataLabels: {
                                  format: '<div style="text-align:center"><span style="font-size:20px;color:' +
                     ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                     '<span style="font-size:12px;color:silver">%</span></div>',
                                  y: -30
                                },
                                tooltip: {
                                    valueSuffix: ' %'
                                }
                            }]

                        });
   } // close "hi_highcharts_eco"

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Info for WMS layer -  BOTH WDPA AND  ECOREGION -  https://astuntechnology.github.io/osgis-ol3-leaflet/leaflet/05-WMS-INFO.html
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
          lMap.on('click', function(e) {
// CHECK IF THE LAYER IS ECOREGION-------------------------------------------------------------------------------------------------------------------------------------
            if (lMap.hasLayer(ecoregion)) {
              var eco_latlng= e.latlng;
              var url_ecoregion = getFeatureInfoUrl_e(
                              lMap,
                              ecoregion,
                              e.latlng,
                              {
                                  'info_format': 'text/javascript',  //it allows us to get a jsonp
                                  'propertyName': 'ecoregion0,ecoregion_,biome,realm,tojson_p_2,tojson_p_3',
                                  'query_layers': 'conservationmapping:ecoregion_protection_connection_dopa_explorer',
                                  'format_options':'callback:getJson'
                              }
                          );

              // ECOREGION - JSONP with the GetFeatureInfo-Request - http://gis.stackexchange.com/questions/211458/using-jsonp-with-leaflet-and-getfeatureinfo-request
               $.ajax({
                       jsonp: false,
                       url: url_ecoregion,
                       dataType: 'jsonp',
                       jsonpCallback: 'getJson',
                       success: handleJson_featureRequest_eco
                     });

                  function handleJson_featureRequest_eco(data1)
                  {
                     // if LAYER COVER THE MAP
                     if (typeof data1.features[0]!=='undefined')
                         {
                            // TAKE THE POERTIES OF THE LAYER
                            var prop1=data1.features[0].properties;
                           // AND TAKE THE ECOREGION ID
                            var filter1="ecoregion0='"+prop1['ecoregion0']+"'";
                           // AND SET THE FILTER OF ECOREGION HIGLIGHTED
                            eco_hi.setParams({CQL_FILTER:filter1});
                            hi_highcharts_eco(prop1,eco_latlng);
                            // SHOW THE DIV CONTAINING GRAPHS AND INFO
                            $( "#block-block-128" ).show(); // RIGHT INFO BOX
                            $( "#print_btn_ecoregion" ).show(); // BUTTON FOR CLIMATE GRAPHS
                      }
                      else {
                        console.log(' no info')
                      }
                  }
            }
// CHECK IF THE LAYER IS WDPA-------------------------------------------------------------------------------------------------------------------------------------
            else {
                       var latlng= e.latlng;
                       var url = getFeatureInfoUrl(
                                       lMap,
                                       wdpa,
                                       e.latlng,
                                       {
                                           'info_format': 'text/javascript',  //it allows us to get a jsonp
                                           'propertyName': 'wdpaid,wdpa_name,desig_eng,desig_type,iucn_cat,jrc_gis_area_km2,status,status_yr,mang_auth',
                                           'query_layers': 'dopa_explorer:mv_wdpa_pa_level_relevant_over50_polygons_agg',
                                           'format_options':'callback:getJson'
                                       }
                                   );

                        // WDPA - JSONP with the GetFeatureInfo-Request - http://gis.stackexchange.com/questions/211458/using-jsonp-with-leaflet-and-getfeatureinfo-request
                        $.ajax({
                                jsonp: false,
                                url: url,
                                dataType: 'jsonp',
                                jsonpCallback: 'getJson',
                                success: handleJson_featureRequest
                              });

                           function handleJson_featureRequest(data)
                           {
                              // if LAYER COVER THE MAP
                              if (typeof data.features[0]!=='undefined')
                                  {
                                     // TAKE THE POERTIES OF THE LAYER
                                     var prop=data.features[0].properties;
                                    // AND TAKE THE WDPA ID
                                     var filter="wdpaid='"+prop['wdpaid']+"'";
                                    // AND SET THE FILTER OF WDPA HIGLIGHTED
                                     wdpa_hi.setParams({CQL_FILTER:filter});
                                     hi_highcharts_pa(prop,latlng);
                                     // SHOW THE DIV CONTAINING GRAPHS AND INFO
                                     $( "#block-block-127" ).show(); // RIGHT INFO BOX
                                     $( "#block-block-132" ).show(); // BUTTON FOR CLIMATE GRAPHS
                                     $("#pa_disclaimer_arrow_climate").show();
                                     $("#pa_climate_plot_title").show();
                                     $("#CLC2005title").show();
                                     $("#disclaimer__arrow_2").show();
                                     $("#glob2005-chart").show();
                                     $("#containerclima2").show();
                                     $("#CLC2000title").show();
                                     $("#disclaimer__arrow_3").show();
                                     $("#glc2000-chart").show();
                                     $("#someinfo").show();
                               }
                               else {
                                 console.log(' no info')
                               }

                           } //close handleJson_featureRequest

                    } //close else

          }); //CLOSE THE onclick function

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// WDPA JSON point LAYER - cartodb
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// WDPA JSON point CARTO LAYER + filter
//---------------------------------------------------------------
   var filter_wdpa = function(feature) {
     return feature.properties.wdpaid > 1;
   }
   var wdpa_group = new L.LayerGroup();
   var query4 = "SELECT * FROM wdpa_gen_2017_controids";
   var sql4 = new cartodb.SQL({ user: 'climateadapttst' });
   sql4.execute(query4, null, { format: 'geojson' }).done(function(data4) {
   // console.info(data4)
   wdpa_layer = L.geoJson(data4, {
               filter: filter_wdpa,
                onEachFeature: function (feature, wdpa_layer) {
                  //NOTHING BEACUSE THE POPUP IS MANAGED BY THE WMS
                  },
                pointToLayer: function (feature, latlng) {
                  var geojsonMarkerOptions = {
                  radius:0.01,
                  opacity: 0,
                  fillOpacity: 0
                  };
                  return L.circleMarker(latlng, geojsonMarkerOptions );
                }
     })//.addTo(lMap);

   wdpa_group.addLayer(wdpa_layer);
      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        //console.info(wdpa_layer)
   wdpa_layer.bringToFront();
   }

  }).done(function(data4) {
    lMap.spin(false);

    });

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//  WDPA WMS GEOSERVER LAYER
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// WDPA WMS GEOSERVER LAYER - SETUP
//---------------------------------------------------------------

var url = 'http://h05-prod-vm11.jrc.it/geoserver/dopa_explorer/wms';
var wdpa=L.tileLayer.wms(url, {
    layers: 'dopa_explorer:mv_wdpa_pa_level_relevant_over50_polygons_agg',
    transparent: true,
    format: 'image/png',
    opacity:'0.6',
    zIndex: 33
 }).addTo(lMap);

//---------------------------------------------------------------
//  WMS LAYER - GET FEATUREINFO FUNCTION
//---------------------------------------------------------------

function getFeatureInfoUrl(map, layer, latlng, params) {

    var point = map.latLngToContainerPoint(latlng, map.getZoom()),
        size = map.getSize(),
        bounds = map.getBounds(),
        sw = bounds.getSouthWest(),
        ne = bounds.getNorthEast();

    var defaultParams = {
        request: 'GetFeatureInfo',
        service: 'WMS',
        srs: 'EPSG:4326',
        styles: '',
        version: layer._wmsVersion,
        format: layer.options.format,
        bbox: bounds.toBBoxString(),
        height: size.y,
        width: size.x,
        layers: layer.options.layers,
        info_format: 'text/javascript'
    };

    params = L.Util.extend(defaultParams, params || {});

    params[params.version === '1.3.0' ? 'i' : 'x'] = point.x;
    params[params.version === '1.3.0' ? 'j' : 'y'] = point.y;

    return layer._url + L.Util.getParamString(params, layer._url, true);
}

//---------------------------------------------------------------
// WDPA WMS LEGEND
//---------------------------------------------------------------
function getColor4(d4) {
   return d4 > 10  ? '#0D7248' :
          d4 > 20  ? '#0D7248':
                    '#BCE3FB';
                  }
    var legend4 = L.control({position: 'bottomleft'});
    legend4.onAdd = function (lMap) {
      var div = L.DomUtil.create('div', 'info legend'),
        labels = ['<div id="wdpalegend"><p> Legend</p></div>'],
        grades4 = [10,20],
        key_labels4 = ['Marine', 'Terrestrial'];
        for (var i4 = 0; i4 < grades4.length; i4++) {div.innerHTML += labels.push('<i style="background:' + getColor4(grades4[i4]) + '"></i> ' + ( key_labels4[i4] ? key_labels4[i4] + '<br>' : '+')); }
        div.innerHTML = labels.join('');
        return div;
};
legend4.addTo(lMap);

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//  WDPA HIGHLIGHT WMS SETUP
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

      var url = 'http://h05-prod-vm11.jrc.it/geoserver/dopa_explorer/wms';
      var wdpa_hi=L.tileLayer.wms(url, {
          layers: 'dopa_explorer:mv_wdpa_pa_level_relevant_over50_polygons_agg_hi',
          transparent: true,
          format: 'image/png',
          opacity:'1',
          zIndex: 34 // Use zIndex to order the tileLayers within the tilePane. The higher number, the upper vertically.
       }).addTo(lMap);

       wdpa_hi.setParams({CQL_FILTER:"wdpa_name LIKE ''"}); // GEOSERVER WMS FILTER

//---------------------------------------------------------------
// SEARCH WDPA
//--------------------------------------------------------------
       var searchwdpa = L.control.search({
       position:'topright',
       layer: wdpa_group,
       zoom:9,
       circleLocation: false,
       wdpa_layer: wdpa_hi,
       textErr: 'Site not found',
       propertyName: 'names',
       textPlaceholder: 'Protected Area...          ',
       buildTip: function(text, val) {
       var type = val.layer.feature.properties.wdpaid;
       return '<a href="#" class="'+type+'"><b>'+text+'</b></a>';

      }
      }).addTo(lMap);

//---------------------------------------------------------------
// ONCLICK RESPONSE ON HIGLIGHTED WDPA
//--------------------------------------------------------------
       function hi_highcharts_pa(info,latlng){
         //CREATE VARIABLES OF EACH COLUMN YOU WANT TO SHOW FROM THE ATTRIBUTE TABLE OF THE WDPA WMS - EACH VARIABLE NEED TO BE SET IN UNDER "getFeatureInfoUrl" FUNCTION
         var name=info['wdpa_name'];
         var wdpaid=info['wdpaid'];
         var desig_eng=info['desig_eng'];
         var desig_type=info['desig_type'];
         var iucn_cat=info['iucn_cat'];
         var gis_area=info['jrc_gis_area_km2'];
         var status=info['status'];
         var status_yr=info['status_yr'];
         var mang_auth=info['mang_auth'];

         //WDPA HIGLIGHTED POPUP
         var popupContentwdpa = '<center><a href="/wdpa/'+wdpaid+'">'+name+'</a></center><hr>';

         var popup = L.popup()
              .setLatLng([latlng.lat, latlng.lng])
              .setContent(popupContentwdpa)
              .openOn(lMap);

         $('#pa_disclaimer_arrow_climate').show();
         $('#pa_climate_plot_title').show();
         $('#disclaimer__arrow_2').show();
         $('#CLC2005title').show();
         $('#disclaimer__arrow_3').show();
         $('#CLC2000title').show();
         $('#print_btn').show();
         $('#print_btn_ecoregion').hide();
         $('#print_btn_reg').hide();
         $('#print_btn_country').hide();
         $('.hidden-print-header-content').show();
        //WDPA HIGLIGHTED HEADER RIGHT BOX
         $('#container8').html('<center><a href="/wdpa/'+wdpaid+'">'+name+'</a></center>');
        //WDPA HIGLIGHTED GENERAL INFO RIGHT BOX
         $('#container2').html('<p><span>Designation &nbsp;</span><b>'+desig_eng+'</b></p>'+
                                '<p><span>Designation Type &nbsp;</span><b>'+desig_type+'</b></p>'+
                                '<p><span>IUCN Category &nbsp;</span><b>'+iucn_cat+'</b></p>'+
                                '<p><span>Reported Area (KM²) &nbsp;</span><b>'+gis_area+'</b></p>'+
                                '<p><span>Year &nbsp;</span><b>'+status_yr+'</b></p>'+
                                '<p><span>Management Authority &nbsp;</span><b>'+mang_auth+'</b></p>'+
                                '<p><span>Status&nbsp;</span><b>'+status+'</b></p>');

          $('#someinfo').html('<p><span><b>'+name+'</b></span> (ID: '+wdpaid+') has been designated as '+desig_eng+' at '+desig_type+' level in '+status_yr+', it covers '+gis_area+' KM² and is managed by '+mang_auth+'.<br><hr></hr><p> ');
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
// WDPA GRAPHS
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
         var url = 'http://dopa-services.jrc.ec.europa.eu/services/ibex/ehabitat/get_radarplot_pa?wdpaid=' + wdpaid; // get radar plot in pa
         var urlclima = 'http://dopa-services.jrc.ec.europa.eu/services/ibex/ehabitat/get_climate_pa?wdpaid=' + wdpaid; // get climate data in pa
         var urlecoregion = 'http://dopa-services.jrc.ec.europa.eu/services/h05ibex/ehabitat/get_ecoregion_in_wdpa?wdpaid=' + wdpaid; // get ecoregion in wdpa -  not used atm
         var urlclc2000 = 'http://dopa-services.jrc.ec.europa.eu/services/ibex/ehabitat/get_wdpa_lc_stats_glc2000?wdpaid='+ wdpaid; //get land cover 2000 in pa
         var urlclc2005 = 'http://dopa-services.jrc.ec.europa.eu/services/ibex/ehabitat/get_wdpa_lc_stats_glob2005?wdpaid=' + wdpaid; //get land cover 2005 in pa


//-----------------------------------------------------------------------------
// spyder graph
//-----------------------------------------------------------------------------
$.ajax({
  url: url,
  dataType: 'json',
  success: function(d) {
      if (d.metadata.recordCount == 0) {
          jQuery('#container3');
          jQuery('#container3').append('');
      } else {
          var title = [];
          var country_avg = [];
          var site_norm_value = [];

          $(d.records).each(function(i, data) {

              switch (data.title) {
                  case 'Agriculture':
                  for (var prop in data) {
                          if (prop == 'title') {
                              title.push("Agriculture")
                          }
                          else if (prop == 'country_avg') {
                              if(data[prop]>=0)
                              country_avg.push(data[prop]);
                              else
                              country_avg.push(0);
                          }
                          else if (prop == 'site_norm_value') {
                              if(data[prop]>=0)
                              site_norm_value.push(data[prop]);
                              else
                              site_norm_value.push(0);
                          }
                          else {
                          }
                      }
                      break;
                  case 'Population':
                  for (var prop in data) {
                          if (prop == 'title') {
                              title.push("Population")
                          }
                          else if (prop == 'country_avg') {
                              if(data[prop]>=0)
                              country_avg.push(data[prop]);
                              else
                              country_avg.push(0);
                          }
                          else if (prop == 'site_norm_value') {
                              if(data[prop]>=0)
                              site_norm_value.push(data[prop]);
                              else
                              site_norm_value.push(0);
                          }
                          else {
                          }
                      }
                      break;
                  case 'Internal Roads':
                  for (var prop in data) {
                                    if (prop == 'title') {
                                        title.push("Internal Roads")
                                    }
                       else if (prop == 'country_avg') {
                           if(data[prop]>=0)
                           country_avg.push(data[prop]);
                           else
                           country_avg.push(0);
                                    }
                       else if (prop == 'site_norm_value') {
                           if(data[prop]>=0)
                           site_norm_value.push(data[prop]);
                           else
                           site_norm_value.push(0);
                                    }
                       else {
                       }
                                }
                      break;
                  case 'Surrounding Roads':
                      for (var prop in data) {
                          if (prop == 'title') {
                              title.push("Surrounding Roads")
                          }
                          else if (prop == 'country_avg') {
                              if(data[prop]>=0)
                              country_avg.push(data[prop]);
                              else
                              country_avg.push(0);
                          }
                          else if (prop == 'site_norm_value') {
                              if(data[prop]>=0)
                              site_norm_value.push(data[prop]);
                              else
                              site_norm_value.push(0);
                          }
                          else {
                          }
                      }
                      break;
                  case 'AMPHIBIA':
                  for (var prop in data) {
                          if (prop == 'title') {
                              title.push("Amphibians")
                          }
                          else if (prop == 'country_avg') {
                              if(data[prop]>=0)
                              country_avg.push(data[prop]);
                              else
                              country_avg.push(0);
                          }
                          else if (prop == 'site_norm_value') {
                              if(data[prop]>=0)
                              site_norm_value.push(data[prop]);
                              else
                              site_norm_value.push(0);
                          }
                          else {
                          }
                      }
                      break;
                  case 'MAMMALIA':
                  for (var prop in data) {
                          if (prop == 'title') {
                              title.push("Mammals")
                          }
                          else if (prop == 'country_avg') {
                              if(data[prop]>=0)
                              country_avg.push(data[prop]);
                              else
                              country_avg.push(0);
                          }
                          else if (prop == 'site_norm_value') {
                              if(data[prop]>=0)
                              site_norm_value.push(data[prop]);
                              else
                              site_norm_value.push(0);
                          }
                          else {
                          }
                      }
                      break;
                  case 'AVES':
                  for (var prop in data) {
                          if (prop == 'title') {
                              title.push("Birds")
                          }
                          else if (prop == 'country_avg') {
                              if(data[prop]>=0)
                              country_avg.push(data[prop]);
                              else
                              country_avg.push(0);
                          }
                          else if (prop == 'site_norm_value') {
                              if(data[prop]>=0)
                              site_norm_value.push(data[prop]);
                              else
                              site_norm_value.push(0);
                          }
                          else {
                          }
                      }
                      break;
                  case 'Popn. change':
                  for (var prop in data) {
                          if (prop == 'title') {
                              title.push("Pop. Change")
                          }
                          else if (prop == 'country_avg') {
                              if(data[prop]>=0)
                              country_avg.push(data[prop]);
                              else
                              country_avg.push(0);
                          }
                          else if (prop == 'site_norm_value') {
                              if(data[prop]>=0)
                              site_norm_value.push(data[prop]);
                              else
                              site_norm_value.push(0);
                          }
                          else {
                          }
                      }
                      break;
                  case 'Terrestrial HDI':
                  // if ($pamarine=='100 % marine'){
                  //  break;
                  // }
                  for (var prop in data) {
                          if (prop == 'title') {
                              title.push("Terrestrial HDI")
                          }
                          else if (prop == 'country_avg') {
                              if(data[prop]>=0)
                              country_avg.push(data[prop]);
                              else
                              country_avg.push(0);
                          }
                          else if (prop == 'site_norm_value') {
                              if(data[prop]>=0)
                              site_norm_value.push(data[prop]);
                              else
                              site_norm_value.push(0);
                          }
                          else {
                          }
                      }
                      break;

                  default:
                      break;
              }


          });


          $('#container3').highcharts({
              chart: {
                  polar: true,
                //  type: 'bar',
                //  zoomType: 'xy',
                   height: 320,
                   width: 420,
                   //colors: ['#c9db72', '#5b8059']
              },

              title: {
                  text: null
              },
              subtitle: {
                  text: "SUMMARY DATA"
              },

              credits: {
                  enabled: true,
                  text: 'DOPA Services',
                  href: 'http://dopa.jrc.ec.europa.eu'
              },
              xAxis: {
                  categories: title,
                  tickmarkPlacement: 'on',
                  lineWidth: 0
              },
              tooltip: {
                  formatter: function() {
                      var s = [];

                      $.each(this.points, function(i, point) {
                          if(point.series.name == "Country Average"){
                              s.push('<span style="color:rgb(124, 181, 236);font-weight:bold;">'+ point.series.name +' : '+
                              point.y +'<span>');
                          }
                          else{
                              s.push('<span style="color:rgb(0, 0, 0);">'+ point.series.name +' : '+
                              point.y +'<span>');
                          }
                      });

                      return s.join('<br>');
                  },
                  shared: true
              },
              yAxis: {
                  lineWidth: 0,
                  min: 0,
                  tickInterval: 10,
                //  min: 0,
                  //max: 100
              },

              series: [{
                  type: 'area',
                  marker: {
                      enabled: false
                  },
                  name: 'Country Average',
                  data: country_avg,
                  color: '#D5DBDF'
              },
              {
                  type: 'line',
                  marker: {
                      enabled: true
                  },
                  name: 'Protected Area',
                  data: site_norm_value,
                  color: '#22a6f5'
              }]
          });
        }
      }
    }).done(function(){
    //-----------------------------------------------------------------------------
    // clc 2000 graph
    //-----------------------------------------------------------------------------
    $.ajax({
        url: urlclc2000,
        dataType: 'json',
        success: function(d) {
            if (d.metadata.recordCount == 0) {
                jQuery('#glc2000-chart');
                //jQuery('#glc2000-chart').append('There is no GLC2000 data for '+ $paname)
            } else {
                var obj = {};
                var colors_array = [];
                var obj_array = [];
                var _classif=[];
                $(d.records).each(function(i, data) {
                    var lclass = data.lclass;
                    obj[lclass] = data;

                        _classif.push(data.label);
                        obj_array.push({name: data.label,data:[data.area],percent:data.percent})

                });

                $('#glc2000-chart').highcharts({

                    chart: {
                        type: 'column',
                        zoomType: 'xy'
                    },
                    title: {
                        text: null
                    },
                    subtitle: {
                         text: 'Landcover 2000'
                    },
                    credits: {
                        enabled: true,
                        text: 'DOPA Services',
                        href: 'http://dopa.jrc.ec.europa.eu'
                    },
                    xAxis: {
                        categories: _classif,
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Area'
                        }
                    },
                    tooltip: {

                       // shared: true,
                         headerFormat: '<span style="font-size:16px">{series.name}</span><br>',
            pointFormat: '<span>{point.name}</span> <b>{point.y:.2f}</b> hectareas <br/>'
                     /*   headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                        */
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },

                                series:
                                   // name: 'Preuba',
                                    obj_array




                });
            }
        },

    }).done(function(){
      //-----------------------------------------------------------------------------
      // clc 2005 graph
      //-----------------------------------------------------------------------------

      $.ajax({
          url: urlclc2005,
          dataType: 'json',
          success: function(d) {
              if (d.metadata.recordCount == 0) {
                  jQuery('#glob2005-chart');
                  //jQuery('#glc2000-chart').append('There is no GLC2000 data for '+ $paname)
              } else {
                  var obj = {};
                  var colors_array = [];
                  var obj_array = [];
                  var _classif=[];
                  $(d.records).each(function(i, data) {
                      var lclass = data.lclass;
                      obj[lclass] = data;

                          _classif.push(data.label);
                          obj_array.push({name: data.label,data:[data.area],percent:data.percent})

                  });

                  $('#glob2005-chart').highcharts({

                      chart: {
                          type: 'column',
                          zoomType: 'xy'
                      },
                      title: {
                          text: null
                      },
                      subtitle: {
                           text: 'Landcover 2005'
                      },
                      credits: {
                          enabled: true,
                          text: 'DOPA Services',
                          href: 'http://dopa.jrc.ec.europa.eu'
                      },
                      xAxis: {
                          categories: _classif,
                          crosshair: true
                      },
                      yAxis: {
                          min: 0,
                          title: {
                              text: 'Area'
                          }
                      },
                      tooltip: {

                         // shared: true,
                           headerFormat: '<span style="font-size:16px">{series.name}</span><br>',
              pointFormat: '<span>{point.name}</span> <b>{point.y:.2f}</b> hectareas <br/>'
                       /*   headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                              '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                          footerFormat: '</table>',
                          shared: true,
                          useHTML: true
                          */
                      },
                      plotOptions: {
                          column: {
                              pointPadding: 0.2,
                              borderWidth: 0
                          }
                      },

                                  series:
                                     // name: 'Preuba',
                                      obj_array




                  });
              }
          },

        });
//-----------------------------------------------------------------------------
//CLIMATE GRAPH
//-----------------------------------------------------------------------------
          $.ajax({
              url: urlclima,
              dataType: 'json',
              success: function(d) {
                  if (d.metadata.recordCount == 0) {
                      //jQuery('#container2');
                      //jQuery('#container2').append('There is no summary data for this WDPA');
                  } else {
                    var precip = [];
                    var tmax = [];
                    var tmin = [];
                    var tmean = [];
                    $(d.records).each(function(i, data) {
                        //	console.warn(i)

                        switch (data.type) {
                            case 'prec':
                                for (var prop in data) {
                                    if (prop !== 'type' && prop !== 'uom') {
                                        precip.push(data[prop])
                                    }
                                }

                                break;
                            case 'tmin':
                                for (var prop in data) {
                                    if (prop !== 'type' && prop !== 'uom')
                                        tmin.push(data[prop])
                                }

                                break;

                            case 'tmax':
                                for (var prop in data) {
                                    if (prop !== 'type' && prop !== 'uom')
                                        tmax.push(data[prop])
                                }
                                break;

                            case 'tmean':

                                for (var prop in data) {
                                    if (prop !== 'type' && prop !== 'uom')
                                        tmean.push(data[prop])
                                }
                                break;
                            default:
                                break;
                        }


                    });


                    $('#containerclima2').highcharts({
                        chart: {
                            zoomType: 'xy',

                        },
                        legend: {

                        },
                        title: {
                            text: null
                        },
                        subtitle: {
                             text: 'Monthly climate averages'
                        },
                        xAxis: [{
                            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                            ]
                        }],
                        yAxis: [{ // Primary yAxis
                            labels: {
                                format: '{value}°C',
                                color: '#3E576F',
                                style: {
                                    //color: Highcharts.getOptions().colors[2]
                                    color: '#3E576F'
                                }
                            },
                            title: {
                                text: 'Temperature',
                                color: '#3E576F',
                                style: {
                                    color: '#3E576F'
                                }
                            },
                            opposite: false

                        }, { // Secondary yAxis
                            gridLineWidth: 0,
                            title: {
                                text: 'Precipitation (mm)',
                                style: {
                                    color: '#3E576F'
                                }
                            },
                            labels: {
                                format: '{value} mm',
                                style: {
                                    color: '#3E576F'
                                }
                            },
                            opposite: true


                        }],
                        tooltip: {
                            shared: true
                        },
                        credits: {
                            enabled: true,
                            text: 'WorldClim',
                            href: 'http://www.worldclim.org/'
                        },
                        series: [{
                          showInLegend: false,
                            name: 'Precipitation',
                            type: 'column',
                            color: '#22a6f5',
                            yAxis: 1,
                            data: precip,
                            tooltip: {
                                valueSuffix: ' mm'
                            }

                        }, {
                          showInLegend: false,
                            name: 'Max Temperature',
                            type: 'spline',
                            color: '#e60000',
                            data: tmax,
                            marker: {
                                enabled: false
                            },
                            dashStyle: 'shortdot',
                            tooltip: {
                                valueSuffix: ' °C'
                            }
                        }, {
                          showInLegend: false,
                            name: 'Mean Temperature',
                            type: 'spline',
                            color: '#fcb100',
                            yAxis: 0,
                            data: tmean,
                            marker: {
                                enabled: false
                            },
                            dashStyle: 'shortdot',
                            tooltip: {
                                valueSuffix: ' °C'
                            }
                        }, {
                          showInLegend: false,
                            name: 'Min Temperature',
                            type: 'spline',
                            color: '#81AFD5',
                            yAxis: 0,
                            data: tmin,
                            marker: {
                                enabled: false
                            },
                            dashStyle: 'shortdot',
                            tooltip: {
                                valueSuffix: ' °C'
                            }
                        }]
                    }); //end of   $('#containerclima2').highcharts
                  } //end of else
              },// end of success: function(d)

          });// end of ajax call
        }) // end of .done(function()
      })// end of .done(function()(583)
}//end of function hi_highcharts_pa

 //-------------------------------------------------------------------------------------------------------------------
 // HIDE "RIGHT INFO BOX" "BUTTON FOR CLIMATE GRAPHS" AND "CLIMATE GRAPHS" WHEN YOU CLICK OUTSIDE OF THE LAYER
 //-------------------------------------------------------------------------------------------------------------------

lMap.on('click',function(e){
    $( "#block-block-128" ).hide();
  //  $( "#block-block-127" ).hide();
    $( "#containerclima" ).hide();
        $( "#block-block-135" ).hide();
    })

lMap.on('popupclose',function(e){
    $( "#block-block-128" ).hide();
    //$( "#block-block-127" ).hide();
    $( "#containerclima" ).hide();
        $( "#block-block-135" ).hide();
    })

//---------------------------------------------------------------
// OPENSTREETMAP SEARCH
//---------------------------------------------------------------
   var searchlocation = L.control.search({
   url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
   jsonpParam: 'json_callback',
   propertyName: 'display_name',
   propertyLoc: ['lat','lon'],
   markerLocation: false,
   //autoCollapse: true,
   autoType: true,
   textPlaceholder: 'Location...                ',
   zoom:5,
   minLength: 2,
   position:'topright'
 }).addTo(lMap);
//----------------------------------------------------------------
// Layers
//----------------------------------------------------------------
   var baseMaps = {
        "Light": streets,
        "Landscape": grayscale
    };
   var overlayMaps = {
        'PROTECTED AREAS':wdpa,
        'COUNTRIES':Country_layer,
        'Ecoregion':ecoregion,
        'REGION':Region_layer,
    };
//---------------------------------------------------------------------
// add remove layers
//----------------------------------------------------------------------
$(".middlewdpa").click(function(event) {
 event.preventDefault();
 if (lMap.hasLayer(wdpa)) {
     lMap.removeLayer(wdpa);
     lMap.removeLayer(wdpa_group);
     $("#print_btn").hide();
     $(".active1").hide();
     $(".inactive1").show();
 }
 else {
   lMap.addLayer(wdpa);
   lMap.addLayer(wdpa_group);
   $("#print_btn").hide();
   $("#print_btn_reg").hide();
   $("#print_btn_ecoregion").hide();
   $("#print_btn_country").hide();
   $(".inactive1").hide();
   $(".active1").show();
 }
});

$(".middlecountry").click(function(event) {
 event.preventDefault();
 if (lMap.hasLayer(Country_layer)) {
     lMap.removeLayer(Country_layer);
     lMap.addLayer(wdpa);
          $("#print_btn_country").hide();
          $( "#block-block-136" ).hide();
          $(".inactive1").hide();
          $(".active1").show();
          $(".active2").hide();
          $(".inactive2").show();
 } else {
     lMap.addLayer(Country_layer);
     lMap.removeLayer(Region_layer);
      lMap.removeLayer(ecoregion);
      lMap.removeLayer(wdpa);
      $(".inactive1").show();
      $(".active1").hide();
      $(".active2").show();
      $(".inactive2").hide();
      $(".active4").hide();
      $(".inactive4").show();
      $(".active3").hide();
      $(".inactive3").show();
      $("#print_btn").hide();
      $("#print_btn_reg").hide();
      $("#print_btn_ecoregion").hide();
      $("#print_btn_country").hide();

      $("#pa_disclaimer_arrow_climate").hide();
      $("#pa_climate_plot_title").hide();
      $("#CLC2005title").hide();
      $("#disclaimer__arrow_2").hide();
      $("#glob2005-chart").hide();
      $("#containerclima2").hide();
      $("#CLC2000title").hide();
      $("#disclaimer__arrow_3").hide();
      $("#glc2000-chart").hide();
      $("#someinfo").hide();
      $( "#block-block-127" ).hide();

 }
});
$(".middleeco").click(function(event) {
 event.preventDefault();
 if (lMap.hasLayer(ecoregion)) {
     lMap.removeLayer(ecoregion);
          lMap.removeLayer(eco_group);
     lMap.addLayer(wdpa);
          $("#print_btn_ecoregion").hide();
 } else {
     lMap.addLayer(ecoregion);
        lMap.addLayer(eco_group);
     lMap.removeLayer(Region_layer);
      lMap.removeLayer(Country_layer);
      lMap.removeLayer(wdpa);
      $(".active2").hide();
      $(".inactive2").show();
      $(".active4").hide();
      $(".inactive4").show();
      $(".active1").hide();
      $(".inactive1").show();
      $("#print_btn").hide();
      $("#print_btn_reg").hide();
      $("#print_btn_ecoregion").hide();
      $("#print_btn_country").hide();

      $("#pa_disclaimer_arrow_climate").hide();
      $("#pa_climate_plot_title").hide();
      $("#CLC2005title").hide();
      $("#disclaimer__arrow_2").hide();
      $("#glob2005-chart").hide();
      $("#containerclima2").hide();
      $("#CLC2000title").hide();
      $("#disclaimer__arrow_3").hide();
      $("#glc2000-chart").hide();
      $("#someinfo").hide();
      $( "#block-block-127" ).hide();
      $( "#block-block-136" ).hide();
 }
});

$(".middlereg").click(function(event) {
 event.preventDefault();
 if (lMap.hasLayer(Region_layer)) {
     lMap.removeLayer(Region_layer);
     lMap.addLayer(wdpa);
          $("#print_btn_reg").hide();
 } else {
     lMap.addLayer(Region_layer);
     lMap.removeLayer(ecoregion);
     lMap.removeLayer(Country_layer);
     lMap.removeLayer(wdpa);
     $(".active2").hide();
     $(".inactive2").show();
     $(".active1").hide();
     $(".inactive1").show();
     $(".active3").hide();
     $(".inactive3").show();
     $("#print_btn").hide();
     $("#print_btn_reg").hide();
     $("#print_btn_ecoregion").hide();
     $("#print_btn_country").hide();

     $("#pa_disclaimer_arrow_climate").hide();
     $("#pa_climate_plot_title").hide();
     $("#CLC2005title").hide();
     $("#disclaimer__arrow_2").hide();
     $("#glob2005-chart").hide();
     $("#containerclima2").hide();
     $("#CLC2000title").hide();
     $("#disclaimer__arrow_3").hide();
     $("#glc2000-chart").hide();
     $("#someinfo").hide();
     $( "#block-block-127" ).hide();
     $( "#block-block-136" ).hide();
 }
});

//-------------------------------------------------------------------------
//print wdpa
//-------------------------------------------------------------------------

$(document).ready(function(e) {
              $('button#print_btn').on('click', function(e)  {
                   $('.generalinfo, #container8, #container3, #container2, #containerclima2, #glc2000-chart, #glob2005-chart').printThis({
          // footer: $('.hidden-print-header-content'),
           loadCSS: "sites/all/themes/bootstrap_business/css/print.css",
           pageTitle:  "DOPA Report",
          //  pageTitle:  "<hr>",
           header: "<img src='sites/default/files/report_logo.png'><br></br><hr></hr><center><b> Digital Observatory for Protected Areas (DOPA) </b><p>Protected Area Report</p></center>"
                  });
              });
           });
 //-------------------------------------------------------------------------
 //print region
 //-------------------------------------------------------------------------

$(document).ready(function(e) {
              $('button#print_btn_reg').on('click', function(e)  {
                   $('#container15, #container14, #container16, #container17').printThis({
          // footer: $('.hidden-print-header-content'),
           loadCSS: "sites/all/themes/bootstrap_business/css/print.css",
           pageTitle: "DOPA Report",
          //  pageTitle:  "<hr>",
           header: "<img src='sites/default/files/report_logo.png'><br></br><hr></hr><b> Digital Observatory for Protected Areas (DOPA) </b><p>Region Report for: </p>"
                  });
              });
           });

//-------------------------------------------------------------------------
//print ecoregion
//-------------------------------------------------------------------------

$(document).ready(function(e) {
             $('button#print_btn_ecoregion').on('click', function(e)  {
                  $('#container5, #container4,  #container24, #container6, #container7').printThis({
         // footer: $('.hidden-print-header-content'),
          loadCSS: "sites/all/themes/bootstrap_business/css/print.css",
          pageTitle:  "DOPA Report",
         //  pageTitle:  "<hr>",
          header: "<img src='sites/default/files/report_logo.png'><br></br><hr></hr><center><b> Digital Observatory for Protected Areas (DOPA) </b><p>Ecoregion Report</p></centre>"
                  });
             });
          });

//-------------------------------------------------------------------------
//print country
//-------------------------------------------------------------------------

$(document).ready(function(e) {
             $('button#print_btn_country').on('click', function(e)  {
                  $('.leaflet-popup-content').printThis({
         // footer: $('.hidden-print-header-content'),
          loadCSS: "sites/all/themes/bootstrap_business/css/print.css",
          pageTitle:  "DOPA Report",
         //  pageTitle:  "<hr>",
          header: "<img src='sites/default/files/report_logo.png'><br></br><hr></hr><b> Digital Observatory for Protected Areas (DOPA) </b><p>Country Report</p>"
                });
             });
          });

//------------------------------------------------------------------------

$(document).ready(function(e) {

$('.search-button').click(function() {
               $parent_box.find('.pabottom').delay(1000).fadeToggle();

              })
          });


//------------------------------------------------------------------------


})

})(jQuery);
