(function($) {
 $(document).bind('leaflet.map', function(e, map, lMap)
   {
     lMap.spin(true);

//------------------------------------------------------------------------------
// BASIC SETUP
//------------------------------------------------------------------------------

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
  var zoomBox = L.control.zoomBox({ modal: false });
  lMap.addControl(zoomBox);

  //----------------------------------------------------------------------------
  // BASE LAYERS
  //----------------------------------------------------------------------------

  var mbAttr = '', mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw';
  var grayscale  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: 'January 2017 version of the World Database on Protected Areas (WDPA)'});
  var grayscale2   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: 'January 2017 version of the World Database on Protected Areas (WDPA)'});//.addTo(lMap);
  var streets  = L.tileLayer('https://api.mapbox.com/styles/v1/lucageo/ciywysi9f002e2snqsz0ukhz4/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibHVjYWdlbyIsImEiOiJjaXIwY2FmNHAwMDZ1aTVubmhuMDYyMmtjIn0.1jWhLwVzKS6k1Ldn-bVQPg',{
attribution: 'January 2017 version of the World Database on Protected Areas (WDPA)'
}).addTo(lMap);
  var esri = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
  maxZoom: 20,
  subdomains:['mt0','mt1','mt2','mt3']
  });

 //set lat long and zoom level
 lMap.setView([20, 0], 3);





//------------------------------------------------------------------------------
// Available Layers
//------------------------------------------------------------------------------
var baseMaps = {
'Landscape': streets,
'Satellite': esri
};
var overlayMaps = {
};

layerControl = L.control.layers(baseMaps, null,  {position: 'bottomleft'});
layerControl.addTo(lMap);

//------------------------------------------------------------------------------
// POPUP & INFO of COUNTRY LAYER - CARTODB
//------------------------------------------------------------------------------

function pop_country_layer(feature, layer) {

   var Popup_Content_Country = '<center><i class="fa fa-globe fa-4x" aria-hidden="true"></i><hr><a href="/country/'+feature.properties.iso_2digit+'">'+feature.properties.co_name+'</a></center>';

   var t_country = function(){
     return [	{
               name: '% of Protection',
               data: [parseFloat(Math.round(feature.properties.count_vals*100)/100)]
               },
               {
               name: '% of Connectivity',
               data: [parseFloat(Math.round(feature.properties.count_vals*100)/100)/2]
               }
             ]
     }

          layer.on('popupopen', function(e) {

            $('#container_country_data').highcharts({
              chart: {type:'bar', height: 300, width: 370},
              colors: ['#56c02a', '#347d15'],
              title: {text: null},
              subtitle: {
                  text: 'Country coverage by protected areas and connectivity'
              },
              credits: {
                  enabled: true,
                  text: '© DOPA Services',
                  href: 'http://dopa.jrc.ec.europa.eu/en/services'
              },
       xAxis: {
              categories: ['%'],
              title: {
                  text: null
              }
          },
       yAxis: {
              max: 50,
              title: {
                  text: 'WDPA version: Jan 2017',
                  align: 'high'
              },
              labels: {
                  overflow: 'justify'
              },
              plotLines: [{
                 color: '#22A6F5',
                 value: '17',
                 width: '2',
                 zIndex: 12
             }]
          },

              series: t_country(feature)

            });

            $('#container_country_name').html('<center><a href="/country/'+feature.properties.iso_2digit+'">'+feature.properties.co_name+'</a></center><hr>');
            $('#container_country_info5').html('<span><div class="sdg_terr_pa"><p>Area Terrestrial</p></div><a href="https://sustainabledevelopment.un.org/sdg15"><img border="0" alt="sdg" src="sites/default/files/sdg_terr.png" width="70" height="70"></a><div class="sdg_terr"><p><b>'+ parseFloat(Math.round(feature.properties.count_vals*100)/100)+'</b>%</p></div><div class="sdg_terr_pa_cov"><p>Coverage</p></div><div class="sdg_terrt"><p><b>'+ parseFloat(feature.properties.shape_area)/2+'</b> km2</p></div><div class="sdg_terr_pat_cov"><p>Land Area Protected</p></div><div class="sdg_terrtotal"><p><b>'+ parseFloat(feature.properties.shape_area)+'</b> km2</p></div><div class="sdg_terr_patotal_cov"><p>Total Land Area</p></div></span>');
            $('#container_country_info4').html('<span><div class="sdg_mar_pa"><p>Area Marine</p></div><a href="https://sustainabledevelopment.un.org/sdg14"><img border="0" alt="sdg" src="sites/default/files/sdg_mar.png" width="70" height="70"></a><div class="sdg_mar"><p><b>'+ parseFloat(Math.round(feature.properties.count_vals*100)/100)+'</b>%</p></div><div class="sdg_mar_pa_cov"><p>Coverage</p></div><div class="sdg_mart"><p><b>'+ parseFloat(feature.properties.shape_area)/2+'</b> km2</p></div><div class="sdg_marr_pat_cov"><p>Marine Area Protected</p></div><div class="sdg_terrtotal_mar"><p><b>'+ parseFloat(feature.properties.shape_area)+'</b> km2</p></div><div class="sdg_mar_patotal_cov"><p>Total Marine Area</p></div></span>');
            // $('#container_country_info3').html('<p>Protection (%) <b>'+ parseFloat(Math.round(feature.properties.count_vals*100)/100)+'</b></p><hr>');
            // $('#container_country_info').html('<p>Conectivity (%) <b>'+ parseFloat(Math.round(feature.properties.count_vals*100)/100)/2+'</b></p><hr>');
            // $('#container_country_info2').html('<p>Additional Info <b> ... </b></p><hr>');
            // $('#container_country_info6').html('<a href="https://www.cbd.int/sp/targets/rationale/target-11/"><img border="0" alt="Aichi Target 11" src="sites/default/files/11.png" width="30" height="30"></a>');
            // $('#visit_country').html('<p><span><a href="/country/'+feature.properties.iso_2digit+'" class="wdpalink" > Explore </a></span></p>');
            // $('#visit_country').show();

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

//------------------------------------------------------------------------------
// LEGEND of COUNTRY LAYER - CARTODB
//------------------------------------------------------------------------------

function getColor(d) {

 return d > 500  ? '#126597' :
        d > 300  ? '#2E7AA7' :
        d > 200  ? '#4A8FB8' :
        d > 100  ? '#67A4C9' :
        d > 75   ? '#83B9D9' :
        d > 50   ? '#9FCEEA' :
        d > 10   ? '#BCE3FB' :
                   '#fff';
}

var legend = L.control({position: 'bottomleft'});
    legend.onAdd = function (lMap) {
        var div = L.DomUtil.create('div', 'info legend'),
         labels = ['<div id="countrylegend"><p>Country coverage by protected areas (%)</p></div>'],
           grades = [10, 50, 75, 100, 200, 300, 500],
           key_labels = [' 1 % ',' 5 % ',' 10 % ',' 20 % ',' 30 % ',' 50 % ',' 75 % '];
               for (var i = 0; i < grades.length; i++) {
                div.innerHTML += labels.push('<i style="background:' + getColor(grades[i] + 1) + '"></i> ' + key_labels[i] + (key_labels[i + 1] ? '&ndash;' + key_labels[i + 1] + '<br>' : '+'));
               }
           div.innerHTML = labels.join('');
         return div;
      };
legend.addTo(lMap);

// styling the GeoJSON layer, uses getColor function above
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
//------------------------------------------------------------------------------
// SETUP of COUNTRY LAYER - CARTODB - highlight AND zoomToFeature
//------------------------------------------------------------------------------

// SQL filter applied on the layer - is gonna be added below to the GeoJSON layer
var filter = function(feature) {
 return feature.properties.cartodb_id > 0;
}

// Highlight layer
function highlightFeature(e) {
 var layer = e.target;
 layer.setStyle({
   weight: 2,
   color: '#ffffff',
   dashArray: '',
   fillOpacity: 0.8
 });
}

// Highlight layer - Reset
function resetHighlight(e) {
  Country_layer.resetStyle(e.target);
}

// Zoom to feature
function zoomToFeature(e) {
  lMap.fitBounds(e.target.getBounds());
}

//------------------------------------------------------------------------------
// CARTO COUNTRY LAYER
//------------------------------------------------------------------------------
var onEachFeature = function(feature, layer) {
       if (feature.properties) {

          pop_country_layer(feature, layer);

          layer.on({
             mouseover: highlightFeature,
             mouseout: resetHighlight,
             'click': function (e) {
                   select(e.target);
                   $( "#block-block-136" ).show();
                    $( ".pabottom" ).hide();
              // zoomToFeatureeco(e);
             }
          });
      }
}

// Define layer
var Country_layer = L.geoJson(null, {
  filter: filter,
  onEachFeature: onEachFeature,
  style: stylecou
});//.addTo(lMap);

// Call to CARTO
var query = "SELECT * FROM world_country_prot";
var sql = new cartodb.SQL({ user: 'climateadapttst' });
sql.execute(query, null, { format: 'geojson' }).done(function(data) {
Country_layer.addData(data);
});

//------------------------------------------------------------------------------
// FUNCTION SELECT (TO SHOW THE GRAPH) OF THE region LAYER
//------------------------------------------------------------------------------
  function select (layer) {
    if (selected !== null) {
        var previous = selected;
        }
    else {}
    selected = layer;
  }

  var selected = null;

//------------------------------------------------------------------------------
//  POPUP & INFO of region LAYER - CARTODB
//------------------------------------------------------------------------------

function pop_region_layer(feature, layer) {

var popupContent1 = '<center><a href="/region/'+feature.properties.continent+'">'+feature.properties.continent+'</a></center><hr>';

var t1=function()
{
  return [	{
            name: '% of Connectivity',
            data: [parseFloat(Math.round(feature.properties.connection*100)/100)]
            },
            {
            name: '% of Protection',
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
               text: 'Region Protection & Connectivity'
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
           },
           plotLines: [{
              color: '#22A6F5',
              value: '17',
              width: '2',
              zIndex: 2
          }]
       },

           series: t1(feature)

         });
          $('#container15').html('<center><a href="/region/'+feature.properties.continent+'">'+feature.properties.continent+'</a></center><hr>');
          $('#container16').html('<hr><p>continet <b>'+feature.properties.continent+'</b></p><hr>');
          $('#container17').html('<p>continent <b>'+feature.properties.continent+'</b></p><hr>');
          // $('#visit_region').html('<p><span><a href="/region/'+feature.properties.continent+'" class="wdpalink" > Explore </a></span></p>');
          // $('#visit_region').show();
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
//------------------------------------------------------------------------------
// LEGEND of REGION LAYER - CARTODB  --> remeber to activate it "legendreg.addTo(lMap);" below
//------------------------------------------------------------------------------
function getColorecor(dreg) {
  return dreg > 100      ? '#10732f' :
         dreg > 75       ? '#1a9641' :
         dreg > 50       ? '#a6d96a' :
         dreg > 30       ? '#ffffbf' :
         dreg > 20       ? '#fdae61' :
         dreg > 5        ? '#e77f80' :
         dreg > 0        ? '#ec3a3c' :
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
//  legendreg.addTo(lMap);

// styling the GeoJSON layer, uses getColor function above
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

//------------------------------------------------------------------------------
// SETUP of REGION LAYER - CARTODB - highlight AND zoomToFeature
//------------------------------------------------------------------------------

// SQL filter applied on the layer - is gonna be added below to the GeoJSON layer
var filterecor = function(feature) {
  return feature.properties.protection > 0;
}
// Highlight Layer
function highlightFeatureecor(e) {
  var layer = e.target;
  layer.setStyle({
    weight: 2,
    color: '#ffffff',
    dashArray: '',
    fillOpacity: 0.8
  });
}
// Highlight Layer - Reset
function resetHighlightecor(e) {
  Region_layer.resetStyle(e.target);
}
// Zoom to feature
function zoomToFeatureeco(e) {
  lMap.fitBounds(e.target.getBounds());
}

//------------------------------------------------------------------------------
// CARTO Region LAYER  -  SETUP
//------------------------------------------------------------------------------
 var onEachFeatureecor = function(feature, layer) {
      if (feature.properties) {

        pop_region_layer(feature,layer);

        layer.on({
             mouseover: highlightFeatureecor,
             mouseout: resetHighlightecor,
             'click': function (e) {
                   select(e.target);
                   $( "#block-block-135" ).show();
                  //  $('#print_btn_reg').show();
                  //  $('#print_btn_ecoregion').hide();
                  //  $('#print_btn_country').hide();
                  //  $('#print_btn').hide();

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
sqlecor.execute(queryecor, null, { format: 'geojson' }).done(function(dataecor) {
Region_layer.addData(dataecor);
      });

//------------------------------------------------------------------------------
// SEARCH region
//------------------------------------------------------------------------------

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

//------------------------------------------------------------------------------
// FUNCTION SELECT (TO SHOW THE GRAPH) OF THE region LAYER
//------------------------------------------------------------------------------
function select (layer) {
  if (selected !== null) {
      var previous = selected;
      }
  else {}
  selected = layer;
}

var selected = null;

//------------------------------------------------------------------------------
// Ecoregion JSON point LAYER - cartodb
//------------------------------------------------------------------------------

var filter_ecoregion = function(feature) {
 return feature.properties.ecoregion_id > 1;
}

var eco_group = new L.LayerGroup();
var query5 = "SELECT * FROM terrestrial_ecoregion_centroids";
var sql5 = new cartodb.SQL({ user: 'climateadapttst' });
sql5.execute(query5, null, { format: 'geojson' }).done(function(data5) {

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
      eco_layer.bringToFront();
      }

})

//------------------------------------------------------------------------------
// SEARCH ecoregion
//------------------------------------------------------------------------------
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

//------------------------------------------------------------------------------
// Ecoregion LAYER -  WMS - Geoserver
//------------------------------------------------------------------------------

var url_ecoregion = 'https://lrm-maps.jrc.ec.europa.eu/geoserver/lrm/wms';
var ecoregion=L.tileLayer.wms(url_ecoregion, {
   layers: 'lrm:eco_mar_ter_prot_con_2016',
   transparent: true,
   format: 'image/png',
   opacity:'0.9',
   zIndex: 33
});

//------------------------------------------------------------------------------
//  Ecoregion LAYER - Get Feature Info
//------------------------------------------------------------------------------

function getFeatureInfoUrl_e(map, layer, latlng, params) {
 //console.log(layer.wmsParams.layers)
if (layer.wmsParams.layers=="lrm:eco_mar_ter_prot_con_2016")
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

     params = L.Util.extend(defaultParams1, params || {});
     params[params.version === '1.3.0' ? 'i' : 'x'] = point1.x;
     params[params.version === '1.3.0' ? 'j' : 'y'] = point1.y;

     return layer._url + L.Util.getParamString(params, layer._url, true);
    }
}

//------------------------------------------------------------------------------
// Ecoregion LAYER - LEGEND
//------------------------------------------------------------------------------
function getColoreco(deco) {
 return deco > 50       ? '#045275' :
        deco > 17       ? '#00718b' :
        deco > 12       ? '#089099' :
        deco > 8        ? '#46aea0' :
        deco > 5        ? '#7ccba2' :
        deco > 2        ? '#b7e6a5' :
        deco > 0        ? '#f7feae' :
                          '#f7feae';
}
var legendeco = L.control({position: 'bottomleft'});
legendeco.onAdd = function (lMap) {
  var div = L.DomUtil.create('div', 'info legend'),
   labels = ['<div id="ecolegend"><p>Ecoregion coverage by protected areas</p></div>'],
     gradeseco = [0, 2, 5, 8, 12, 17, 50],
     key_labelseco = [' 0% ',' 2% ',' 5% ',' 8% ',' 12% ',' 17%',' 50% '];
         for (var ieco = 0; ieco < gradeseco.length; ieco++) {
          div.innerHTML += labels.push('<i style="background:' + getColoreco(gradeseco[ieco ] + 1) + '"></i> ' + key_labelseco[ieco] + (key_labelseco[ieco + 1] ? '&ndash;' + key_labelseco[ieco + 1] + '<br>' : '+'));
         }
     div.innerHTML = labels.join('');
   return div;
};
legendeco.addTo(lMap);

//------------------------------------------------------------------------------
//  Ecoregion LAYER - HIGHLIGHT WMS
//------------------------------------------------------------------------------

var url_ecoregion = 'https://lrm-maps.jrc.ec.europa.eu/geoserver/lrm/wms';
var eco_hi=L.tileLayer.wms(url_ecoregion, {
   layers: 'lrm:eco_mar_ter_prot_con_2016_hi',
   transparent: true,
   format: 'image/png',
   opacity:'1',
   zIndex: 34
}).addTo(lMap);

eco_hi.setParams({CQL_FILTER:"eco_name LIKE ''"});


//------------------------------------------------------------------------------
// Ecoregion LAYER - ONCLICK RESPONSE ON HIGLIGHTED ECOREGION
//------------------------------------------------------------------------------
function hi_highcharts_eco(info,latlng){

  //create variables of each column you want to show from the attribute table of the wdpa wms - each variable need to be set in under "getfeatureinfourl" function
  var eco_name=info['eco_name'];
  var id=info['id'];
  var biome=info['biome'];
  var realm=info['realm'];
  var connect=info['connect'];
  var protection=info['protection'];
  var area=info['area'];

  // Ecoregion higlighted popup
  var popupContenteco = '<center><i class="fa fa-envira fa-2x" aria-hidden="true"></i><hr><a href="/ecoregion/'+id+'">'+eco_name+'</a></center><hr>';

  var popup_eco = L.popup()
       .setLatLng([latlng.lat, latlng.lng])
       .setContent(popupContenteco)
       .openOn(lMap);
       // Ecoregion NAME
       $('#container5').html('<center><a href="/ecoregion/'+id+'">'+eco_name+'</a></center>');
       // Ecoregion BIOME
       $('#container55').html('<p>Area (km2) <b>'+parseFloat(Math.round(area*100)/100)+'</b></p><hr>');
       $('#container6').html('<hr><p>Biome <b>'+biome+'</b></p><hr>');
       // Ecoregion REALM
       $('#container7').html('<p>Realm <b>'+realm+'</b></p><hr>');
       // Ecoregion Explore button
      //  $('#visit_ecoregion').html('<p><span><a href="/ecoregion/'+id+'" class="wdpalink" > Explore </a></span></p>');
       // Ecoregion Protection Gauge Graph
       $('#container4').highcharts ({

               chart: {
                   type: 'solidgauge',
                   backgroundColor: 'rgba(255, 255, 255, 0)',
                   borderColor: '#ffffff'           },

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
                           y: -73
                      },

                      stops: [
                          [0.0, '#f7feae'],   // yellow
                          [0.02, '#b7e6a5'],  // light green
                          [0.05, '#7ccba2'],  // green
                          [0.08, '#46aea0'],  // dark green
                          [0.12, '#089099'],  // light blue
                          [0.17, '#00718b'],  // blue
                          [0.5, '#045275']    // dark blue
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

             // Ecoregion Connectivity Gauge Graph
             $('#container24').highcharts ({

               chart: {
                   type: 'solidgauge',
                   backgroundColor: 'rgba(255, 255, 255, 0)',
                   borderColor: '#ffffff'
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
                           y: -73
                      },

                      stops: [
                        [0.0, '#f7feae'],   // yellow
                        [0.02, '#b7e6a5'],  // light green
                        [0.05, '#7ccba2'],  // green
                        [0.08, '#46aea0'],  // dark green
                        [0.12, '#089099'],  // light blue
                        [0.17, '#00718b'],  // blue
                        [0.5, '#045275']    // dark blue

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
                      name: 'Connectivity',
                      data: [parseFloat(Math.round(connect*100)/100)],
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

          }); // container24
} // hi_highcharts_eco

//------------------------------------------------------------------------------
// Info for WMS layer -  BOTH WDPA AND  ECOREGION -  https://astuntechnology.github.io/osgis-ol3-leaflet/leaflet/05-WMS-INFO.html
//------------------------------------------------------------------------------

lMap.on('click', function(e) {

// check if the layer is Ecoregion
  if (lMap.hasLayer(ecoregion)) {
    var eco_latlng= e.latlng;
    var url_ecoregion = getFeatureInfoUrl_e(
                    lMap,
                    ecoregion,
                    e.latlng,
                    {
                        'info_format': 'text/javascript',  //it allows us to get a jsonp
                        'propertyName': 'area,id,eco_name,biome,realm,protection,connect',
                        'query_layers': 'lrm:eco_mar_ter_prot_con_2016',
                        'format_options':'callback:getJson'
                    }
                );

    // Ecoregion - JSONP with the GetFeatureInfo-Request - http://gis.stackexchange.com/questions/211458/using-jsonp-with-leaflet-and-getfeatureinfo-request
     $.ajax({
             jsonp: false,
             url: url_ecoregion,
             dataType: 'jsonp',
             jsonpCallback: 'getJson',
             success: handleJson_featureRequest_eco
           });

        function handleJson_featureRequest_eco(data1)
        {
           // if layer cover the map
           if (typeof data1.features[0]!=='undefined')
               {
                  // take the poerties of the layer
                  var prop1=data1.features[0].properties;

                 // and take the ecoregion id
                  var filter1="id='"+prop1['id']+"'";

                 // and set the filter of ecoregion higlighted
                  eco_hi.setParams({CQL_FILTER:filter1});
                  hi_highcharts_eco(prop1,eco_latlng);

                  // show the div containing graphs and info
                  $( "#block-block-128" ).show(); // RIGHT INFO BOX
                  // $('#visit_ecoregion').show();

            }
            else {
              console.log(' no info')
            }
        }
  }

// Check if the layer is WDPA
  else {
             var latlng= e.latlng;
             var url = getFeatureInfoUrl(
                             lMap,
                             wdpa,
                             e.latlng,
                             {
                                 'info_format': 'text/javascript',  //it allows us to get a jsonp
                                 'propertyName': 'wdpaid,wdpa_name,desig_eng,desig_type,iucn_cat,jrc_gis_area_km2,rep_area,status,status_yr,mang_auth,country,iso3',
                                 'query_layers': 'dopa_explorer:mv_wdpa_pa_level_relevant_over50_polygons_country_name_agg',
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
                          // $( "#block-block-132" ).show(); // BUTTON FOR CLIMATE GRAPHS
                          // $("#pa_disclaimer_arrow_climate").show();
                           //$("#pa_disclaimer_arrow_elevation").show();
                          // $("#pa_climate_plot_title").show();
                          // $("#pa_elevation_plot_title").show();
                           //$("#CLC2005title").show();
                          // $("#disclaimer__arrow_2").show();
                           //$("#glob2005-chart").show();
                          // $("#containerclima2").show();
                           //$("#container_elevation").show();
                           //$("#CLC2000title").show();
                          // $("#disclaimer__arrow_3").show();
                          // $("#glc2000-chart").show();
                           $("#someinfo").show();
                          //  $('#visit_wdpa').show();
                     }
                     else {
                       console.log(' no info')
                     }

                } // Close handleJson_featureRequest

  } // Close else

}); // Close onclick function

//------------------------------------------------------------------------------
// WDPA JSON point LAYER - cartodb
//------------------------------------------------------------------------------

var filter_wdpa = function(feature) {
 return feature.properties.wdpaid > 1;
}
var wdpa_group = new L.LayerGroup();
var query4 = "SELECT * FROM wdpa_gen_2017_controids";
var sql4 = new cartodb.SQL({ user: 'climateadapttst' });

sql4.execute(query4, null, { format: 'geojson' }).done(function(data4) {

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

      wdpa_layer.bringToFront();

      }

}).done(function(data4) {
lMap.spin(false);
});

//------------------------------------------------------------------------------
//  WDPA WMS GEOSERVER LAYER
//------------------------------------------------------------------------------

var url = 'https://lrm-maps.jrc.ec.europa.eu/geoserver/dopa_explorer/wms';
var wdpa=L.tileLayer.wms(url, {
    layers: 'dopa_explorer:mv_wdpa_pa_level_relevant_over50_polygons_country_name_agg',
    transparent: true,
    format: 'image/png',
    opacity:'0.6',
    zIndex: 33
 }).addTo(lMap);

//------------------------------------------------------------------------------
//  WMS LAYER - GET FEATUREINFO FUNCTION
//------------------------------------------------------------------------------

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
  return d4 > 10  ?   '#7db132' :
         d4 > 20  ?   '#7db132':
                      '#80bfd9';
                  }
var legend4 = L.control({position: 'bottomleft'});
legend4.onAdd = function (lMap) {
  var div = L.DomUtil.create('div', 'info legend'),
    labels = ['<div id="wdpalegend"><p> Protected area type</p></div>'],
    grades4 = [10,20],
    key_labels4 = ['Marine', 'Terrestrial'];
    for (var i4 = 0; i4 < grades4.length; i4++) {div.innerHTML += labels.push('<i style="background:' + getColor4(grades4[i4]) + '"></i> ' + ( key_labels4[i4] ? key_labels4[i4] + '<br>' : '+')); }
    div.innerHTML = labels.join('');
    return div;
};
legend4.addTo(lMap);

//------------------------------------------------------------------------------
//  WDPA HIGHLIGHT WMS
//------------------------------------------------------------------------------

var url = 'https://lrm-maps.jrc.ec.europa.eu/geoserver/dopa_explorer/wms';
var wdpa_hi=L.tileLayer.wms(url, {
    layers: 'dopa_explorer:mv_wdpa_pa_level_relevant_over50_polygons_country_name_agg_hi',
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
 //Create variables of each column you want to show from the attribute table of the wdpa wms - each variable need to be set in under "getfeatureinfourl" function
 var name=info['wdpa_name'];
 var wdpaid=info['wdpaid'];
 var desig_eng=info['desig_eng'];
 var desig_type=info['desig_type'];
 var iucn_cat=info['iucn_cat'];
 var gis_area=info['jrc_gis_area_km2'];
 var reported_area=info['rep_area'];
 var status=info['status'];
 var status_yr=info['status_yr'];
 var mang_auth=info['mang_auth'];
 var country=info['country'];
 var iso3=info['iso3'];
 var iso3_first=iso3.slice(0,3);

  //WDPA HIGLIGHTED POPUP

  if (gis_area > 99){
  var popupContentwdpa = '<center><i class="fa fa-envira fa-2x" aria-hidden="true"></i><br></br><a href="/wdpa/'+wdpaid+'">'+name+'</a></center>';
  // when available add: <center><i class="fa fa-globe fa-2x" aria-hidden="true"></i><br></br><a href="/country/'+iso3_first+'">'+country+'</a></center><hr>
  }
  else{
  var popupContentwdpa = '<center><i class="fa fa-envira fa-2x" aria-hidden="true"></i><br></br><p>'+name+'</p></center>';
  // when available add: <center><i class="fa fa-globe fa-2x" aria-hidden="true"></i><br></br><a href="/country/'+iso3_first+'">'+country+'</a></center><hr>
  }
 var popup = L.popup()
      .setLatLng([latlng.lat, latlng.lng])
      .setContent(popupContentwdpa)
      .openOn(lMap);

    // $('#pa_disclaimer_arrow_climate').show();
    // $('#pa_disclaimer_arrow_elevation').show();
    // $('#pa_climate_plot_title').show();
    // $('#pa_elevation_plot_title').show();
    // $('#disclaimer__arrow_2').show();
    // $('#CLC2005title').show();
    // $('#disclaimer__arrow_3').show();
    // $('#CLC2000title').show();
    // $('#print_btn').show();
    // $('#print_btn_ecoregion').hide();
    // $('#print_btn_reg').hide();
    // $('#print_btn_country').hide();
    // $('.hidden-print-header-content').show();


    //WDPA HIGLIGHTED HEADER RIGHT BOX

    if (gis_area > 99){
    $('#container8').html('<center><a href="/wdpa/'+wdpaid+'">'+name+'</a><b> ('+country+') </b></center>');
    } else{
    $('#container8').html('<center><b>'+name+'</b></center>');
    }

    //WDPA higlighted general info bottom-right box
    $('#container2').html('<p><span>Designation &nbsp;</span><b>'+desig_eng+'</b></p>'+
                          '<p><span>Designation Type &nbsp;</span><b>'+desig_type+'</b></p>'+
                          '<p><span>IUCN Category &nbsp;</span><b>'+iucn_cat+'</b></p>'+
                          '<p><span>Reported Area (km²) &nbsp;</span><b>'+parseFloat(Math.round(reported_area*100)/100)+'</b></p>'+
                          '<p><span>Year &nbsp;</span><b>'+status_yr+'</b></p>'+
                          '<p><span>Management Authority &nbsp;</span><b>'+mang_auth+'</b></p>'+
                          '<p><span>Status&nbsp;</span><b>'+status+'</b></p>');

      //WDPA higlighted general info below map
      $('#someinfo').html('<em><span><b>'+name+'</b></span> (ID: '+wdpaid+') is in <span><b>'+country+'</b></span>, has been designated as '+desig_eng+' at '+desig_type+' level<em class="year_des"> in <span><b class ="years">'+status_yr+'</b></em></span>, it covers <span><b>'+parseFloat(Math.round(gis_area*100)/100)+' km² </b></span><em class="mang_auth">and is managed by '+mang_auth+'</em></span>.<br><hr></hr><em> ');
      // when is available add: <a href="/country/'+iso3_first+'" class="countrylink" >'+country+'</a>

      // show explore button when is bigger than 99 km2 ----> to be changed to "50"
      // if (gis_area > 99){
      //   $('#visit_wdpa').html('<p><span><a href="/wdpa/'+wdpaid+'" class="wdpalink" > Explore </a></span></p>');
      // }else{
      //   $('#visit_wdpa').html('<p><span><a href="mailto:JRC-DOPA@ec.europa.eu" class="wdpalink" > Keep in touch for updates </a></span></p>');
      // }
      // hide management auth. when not reported
      var auth = $('.mang_auth').html();
      if (auth.match(/Not Reported*/)){
      	$('.mang_auth').hide();
      }
      // hide year when is 0
      var year_des = $('.years').html();
      if (year_des == "0"){
        $('.year_des').hide();
      }

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
// WDPA GRAPHS
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
       var url = 'http://dopa-services.jrc.ec.europa.eu/services/ibex/ehabitat/get_radarplot_pa?wdpaid=' + wdpaid; // get radar plot in pa
       var urlclima = 'http://dopa-services.jrc.ec.europa.eu/services/ibex/ehabitat/get_climate_pa?wdpaid=' + wdpaid; // get climate data in pa
       var urlecoregion = 'http://dopa-services.jrc.ec.europa.eu/services/h05ibex/ehabitat/get_ecoregion_in_wdpa?wdpaid=' + wdpaid; // get ecoregion in wdpa -  not used atm
       var urlclc2000 = 'http://dopa-services.jrc.ec.europa.eu/services/ibex/ehabitat/get_wdpa_lc_stats_glc2000?wdpaid='+ wdpaid; //get land cover 2000 in pa
       var urlclc2005 = 'http://dopa-services.jrc.ec.europa.eu/services/ibex/ehabitat/get_wdpa_lc_stats_glob2005?wdpaid=' + wdpaid; //get land cover 2005 in pa
       var urlelevation = 'http://dopa-services.jrc.ec.europa.eu/services/ibex/ehabitat/get_topo_pa?wdpaid=' + wdpaid; //get elevation


//-----------------------------------------------------------------------------
//  WDPA Spyder graph - Overall condition
//-----------------------------------------------------------------------------

$.ajax({
  url: url,
  dataType: 'json',
  success: function(d) {
      if (d.metadata.recordCount == 0) {
          jQuery('#container3');
          jQuery('#container3').html('<img src="/sites/default/files/sna.png" alt="Mountain View" style="width:421px;height:242px;">');
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
                   height: 320,
                   width: 420,
              },

              title: {
                  text: null
              },
              subtitle: {
                  text: "SUMMARY DATA"
              },

              credits: {
                  enabled: true,
                  text: '© DOPA Services',
                  href: 'http://dopa.jrc.ec.europa.eu/en/services'
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
    });

}//end of function hi_highcharts_pa

 //-------------------------------------------------------------------------------------------------------------------
 // HIDE "RIGHT INFO BOX" "BUTTON FOR CLIMATE GRAPHS" AND "CLIMATE GRAPHS" WHEN YOU CLICK OUTSIDE OF THE LAYER
 //-------------------------------------------------------------------------------------------------------------------

lMap.on('click',function(e){
      $( "#block-block-128" ).hide();
      $( "#block-block-127" ).hide();
      $( "#containerclima" ).hide();
      $( "#block-block-135" ).hide();
      $( "#block-block-136" ).hide();
      $( ".pabottom" ).hide();
    })

lMap.on('popupclose',function(e){
    // $( "#block-block-128" ).hide();
    // $( "#block-block-127" ).hide();
    // $( "#containerclima" ).hide();
    // $( "#block-block-135" ).hide();
    $( "#block-block-136" ).hide();
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
$(".patopwdpa").click(function(event) {
 event.preventDefault();
 if (lMap.hasLayer(wdpa)) {

      lMap.removeLayer(wdpa_group);
      $(".patopwdpa").css('background-color', '#f9f9f9').css('color', '#22A6F5');
      $(".patopecoregion").css("background-color", 'white').css('color', '#828282');
      $(".patopcountry").css('background-color', 'white').css('color', '#828282');

 }
 else {
      lMap.addLayer(wdpa);
      lMap.addLayer(wdpa_hi);
      lMap.addLayer(wdpa_group);
      lMap.removeLayer(Country_layer);
      lMap.removeLayer(Region_layer);
      lMap.removeLayer(eco_hi);
      lMap.removeLayer(ecoregion);
      $('#block-block-128').hide();
      lMap.closePopup();
      $(".patopwdpa").css('background-color', '#f9f9f9').css('color', '#22A6F5');
      $(".patopecoregion").css("background-color", 'white').css('color', '#828282');
      $(".patopcountry").css('background-color', 'white').css('color', '#828282');
 }
});

$(".patopcountry").click(function(event) {
 event.preventDefault();
 if (lMap.hasLayer(Country_layer)) {

   $(".patopecoregion").css('background-color', 'white').css('color', '#828282');
   $(".patopcountry").css('background-color', '#f9f9f9').css('color', '#22A6F5');
   $(".patopwdpa").css('background-color', 'white').css('color', '#828282');

 } else {
      lMap.addLayer(Country_layer);
      lMap.removeLayer(Region_layer);
      lMap.removeLayer(ecoregion);
      lMap.removeLayer(wdpa);
      lMap.closePopup();

      $("#someinfo").hide();
      $( "#block-block-127" ).hide();
      $( "#block-block-128" ).hide();
      $(".patopwdpa").css('background-color', 'white').css('color', '#828282');
      $(".patopecoregion").css("background-color", 'white').css('color', '#828282');
      $(".patopcountry").css('background-color', '#f9f9f9').css('color', '#22A6F5');

 }
});


$(".patopecoregion").click(function(event) {
 event.preventDefault();
 if (lMap.hasLayer(ecoregion)) {

      $(".patopecoregion").css('background-color', '#f9f9f9').css('color', '#22A6F5');
      $(".patopcountry").css('background-color', 'white').css('color', '#828282');
      $(".patopwdpa").css('background-color', 'white').css('color', '#828282');

 } else {
      lMap.addLayer(ecoregion);
      lMap.addLayer(eco_hi);
      lMap.addLayer(eco_group);
      lMap.removeLayer(Region_layer);
      lMap.removeLayer(Country_layer);
      lMap.removeLayer(wdpa);
      lMap.removeLayer(wdpa_hi);
      lMap.closePopup();

      $("#someinfo").hide();
      $( "#block-block-127" ).hide();
      $( "#block-block-136" ).hide();
      $(".patopecoregion").css('background-color', '#f9f9f9').css('color', '#22A6F5');
      $(".patopcountry").css('background-color', 'white').css('color', '#828282');
      $(".patopwdpa").css('background-color', 'white').css('color', '#828282');
 }
});

// $(".middlereg").click(function(event) {
//  event.preventDefault();
//  if (lMap.hasLayer(Region_layer)) {
//       lMap.removeLayer(Region_layer);
//       lMap.addLayer(wdpa);
//       // $('#visit_region').hide();
//       //$("#someinfo").show();
//       // $("#print_btn_reg").hide();
//  } else {
//      lMap.addLayer(Region_layer);
//      lMap.removeLayer(ecoregion);
//      lMap.removeLayer(Country_layer);
//      lMap.removeLayer(wdpa);
//      $(".active2").hide();
//      $(".inactive2").show();
//      $(".active1").hide();
//      $(".inactive1").show();
//      $(".active3").hide();
//      $(".inactive3").show();
//
//      $("#someinfo").hide();
//
//      $( "#block-block-127" ).hide();
//      $( "#block-block-136" ).hide();
//  }
// });




//-----------------------------------------------------------------------------
// Opacity Slider
//-----------------------------------------------------------------------------

// WDPA opacity slider
var sliderVal;

$(function () {
        $('#rangeSlider1').bootstrapSlider().on('slide', function (ev) {
            sliderVal = ev.value;
            wdpa.setOpacity(sliderVal/100);
        });
        if (sliderVal) {
            $('#rangeSlider1').bootstrapSlider('setValue', sliderVal);
        }
});
    function rangeSlider(sliderVal) {
     wdpa.setOpacity(sliderVal)
    }

// COUNTRY opacity slider----------------------------------------------
var sliderVal;
    $(function () {
            $('#rangeSlider2').bootstrapSlider().on('slide', function (ev) {
                sliderVal = ev.value;
                Country_layer.setStyle({fillOpacity :sliderVal/100});
            });
            if (sliderVal) {
                $('#rangeSlider2').bootstrapSlider('setValue', sliderVal);
            }
    });
        function rangeSlider(sliderVal) {
         Country_layer.setStyle({fillOpacity :sliderVal});
        }
// ECOREGION opacity slider----------------------------------------------
var sliderVal;
    $(function () {
            $('#rangeSlider3').bootstrapSlider().on('slide', function (ev) {
                sliderVal = ev.value;
                ecoregion.setOpacity(sliderVal/100);
            });
            if (sliderVal) {
                $('#rangeSlider3').bootstrapSlider('setValue', sliderVal);
            }
    });
        function rangeSlider(sliderVal) {
         ecoregion.setOpacity(sliderVal)
        }
//-----------------------------------------------------------------------------
// END OF Opacity Slider
//-----------------------------------------------------------------------------






















// end of the script
})

})(jQuery);
