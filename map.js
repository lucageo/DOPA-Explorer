(function($) {
 $(document).bind('leaflet.map', function(e, map, lMap)
   {
    lMap.spin(true, {
      lines: 11,
      length: 39,
      width: 2,
      radius: 78,
      corners: 0,
      opacity: 0,
      speed: 1,
      trail: 89,
      shadow:'on',
      hwaccel:'on'
    });

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
    $(".leaflet-control-attribution").css('position', 'absolute');
  });
  lMap.on('exitFullscreen', function(){
    if(window.console) window.console.log('exitFullscreen');
    $(".leaflet-control-attribution").css('position', 'relative');
  });
  L.control.navbar().addTo(lMap);
  var zoomBox = L.control.zoomBox({ modal: false });
  lMap.addControl(zoomBox);
//lMap.scrollWheelZoom.disable();

//----------------------------------------------------------------------------
// BASE LAYERS
//----------------------------------------------------------------------------

var mbAttr = '', mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw';
var grayscale  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: 'October 2017 version of the World Database on Protected Areas (WDPA)'});
var grayscale2   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: 'October 2017 version of the World Database on Protected Areas (WDPA)'});//.addTo(lMap);

var streets  = L.tileLayer('https://api.mapbox.com/styles/v1/lucageo/cjajjjqnzav1w2smvm1kub1hw/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibHVjYWdlbyIsImEiOiJjaXIwY2FmNHAwMDZ1aTVubmhuMDYyMmtjIn0.1jWhLwVzKS6k1Ldn-bVQPg',{attribution: 'October 2017 version of the World Database on Protected Areas (WDPA)'}).addTo(lMap);
var esri = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{ maxZoom: 20, subdomains:['mt0','mt1','mt2','mt3']});

//set lat long and zoom level
lMap.setView([20, 0], 3);

//----------------------------------------------------------------------------
// WDPA ALL LAYERS
//----------------------------------------------------------------------------

 var wurla = 'http://lrm-maps.jrc.ec.europa.eu/geoserver/conservationmapping/wms';
 var wdpa_a=L.tileLayer.wms(wurla, {
     layers: 'conservationmapping:WDPA_poly_Sep2017',
     transparent: true,
     format: 'image/png',
     opacity:'1',
     zIndex: 10
  });
 // SHOW WDPA ALL ONLY AT BIG SCALE
  lMap.on('zoomend', function() {
      if (lMap.getZoom() < 8){

              lMap.removeLayer(wdpa_a);
              wdpa.setOpacity(1);

      } else if (lMap.getZoom() >= 8){
        lMap.addLayer(wdpa_a);
        wdpa.setOpacity(0.3);
      } else{}

  });


//------------------------------------------------------------------------------
// BASEMAPS Layers - DISPLAYED ON THE MAP
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
// FUNCTION SELECT
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
   opacity:'0.6',
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
 return deco > 50       ? '#022528' :
        deco > 17       ? '#287274' :
        deco > 12       ? '#448c8a' :
        deco > 8        ? '#63a6a0' :
        deco > 5        ? '#89c0b6' :
        deco > 2        ? '#b4d9cc' :
        deco > 0        ? '#e4f1e1' :
                          '#e4f1e1';
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
  var is_marine=info['is_marine'];
  var biome=info['biome'];
  var realm=info['realm'];
  var connect=info['connect'];
  var protection=info['protection'];
  var area=info['area'];

  // Ecoregion higlighted popup
  if (is_marine ==='No' ) {

    var popupContenteco = '<center><i class="fa fa-tree fa-2x" aria-hidden="true"></i><hr><p>'+eco_name+'</p><hr><a href="/ecoregion/'+id+'">SEE REPORT</a></center>';

    $('#container4').highcharts({
      chart: {type:'bar', height: 300, width: 370,
      backgroundColor:'rgba(255, 255, 255, 0)'
    },
      colors: ['#297177', '#128488'],
      title: {text: null},
      subtitle: {
          text: 'Ecoregion coverage by terrestrial protected areas and connectivity'
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
               color: '#5f5f5f',
               value: '17',
               width: '2',
               zIndex: 12
           }]
        },

      series: [	{
                name: '% of Protection',
                data: [parseFloat(Math.round(protection*100)/100)]
                },
                {
                name: '% of Connectivity',
                data: [parseFloat(Math.round(connect*100)/100)/2]
                }
              ]

    });
  }
  else {

    var popupContenteco = '<center><i class="fa fa-tint fa-2x" aria-hidden="true"></i><hr><p>'+eco_name+'</p><hr><a href="/ecoregion/'+id+'">SEE REPORT</a></center>';

    $('#container4').highcharts({
      chart: {type:'bar', height: 300, width: 370,
      backgroundColor:'rgba(255, 255, 255, 0)'
    },
      colors: ['#297177', '#128488'],
      title: {text: null},
      subtitle: {
          text: 'Ecoregion coverage by protected areas'
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
               color: '#5f5f5f',
               value: '17',
               width: '2',
               zIndex: 12
           }]
        },

      series: [	{
                name: '% of Protection',
                data: [parseFloat(Math.round(protection*100)/100)]
                }

              ]

    });
}
  var popup_eco = L.popup()
       .setLatLng([latlng.lat, latlng.lng])
       .setContent(popupContenteco)
       .openOn(lMap);
       // Ecoregion NAME
       $('#container5').html('<center><a href="/ecoregion/'+id+'">'+eco_name+'</a></center>');
       // Ecoregion AREA
       $('#container55').html('<p>Area (km2) <b>'+parseFloat(Math.round(area*100)/100)+'</b></p><hr>');
      // Ecoregion BIOME
       $('#container6').html('<p>Biome <b>'+biome+'</b></p><hr>');
       // Ecoregion REALM
       $('#container7').html('<p>Realm <b>'+realm+'</b></p><hr>');
       // Ecoregion AICHI 17
       $('#container24').html('<p>Aichi Target 11 treshold (17%)</p><hr>');
       // Ecoregion Protection  Graph

} // end of 'hi_highcharts_eco' fuction

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
                        'propertyName': 'area,id,eco_name,biome,is_marine,realm,protection,connect',
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
                  $( "#block-block-128" ).show();

            }
            else {
              // console.log(' no info')
            }
        }
  }

// Check if the layer is WDPA
  else if (lMap.hasLayer(wdpa)) {
             var latlng= e.latlng;
             var url = getFeatureInfoUrl(
                             lMap,
                             wdpa,
                             e.latlng,
                             {
                                 'info_format': 'text/javascript',  //it allows us to get a jsonp
                                 'propertyName': 'wdpaid,wdpa_name,desig_eng,desig_type,iucn_cat,jrc_gis_area_km2,rep_area,status,status_yr,mang_auth,country,iso3',
                                 'query_layers': 'dopa_explorer_2:dopa_geoserver_wdpa_master',
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
                           $( "#block-block-127" ).show();
                           $("#someinfo").show();
                     }
                     else {
                      //  console.log(' no info')
                     }

                } // Close handleJson_featureRequest

  } else{

   // Check if the layer is country
    var cou_gs_latlng= e.latlng;
    var url_cou_gs = getFeatureInfoUrl_c(
                    lMap,
                    country_gs,
                    e.latlng,
                    {
                        'info_format': 'text/javascript',  //it allows us to get a jsonp
                        'propertyName': 'name_c,iso_2digit,t_prot_per,t_pro_area,t_conn_per,mar_area,m_prot_per,m_pro_area,land_area',
                        'query_layers': 'dopa_explorer:dopa_countries_new_better5',
                        'format_options':'callback:getJson'
                    }
                );


    // country - JSONP with the GetFeatureInfo-Request - http://gis.stackexchange.com/questions/211458/using-jsonp-with-leaflet-and-getfeatureinfo-request
     $.ajax({
             jsonp: false,
             url: url_cou_gs,
             dataType: 'jsonp',
             jsonpCallback: 'getJson',
             success: handleJson_featureRequest_cou_gs
           });

        function handleJson_featureRequest_cou_gs(data2)
        {
           // if layer cover the map
           if (typeof data2.features[0]!=='undefined')
               {
                  // take the poerties of the layer
                  var prop2=data2.features[0].properties;

                 // and take the ecoregion id
                  var filter2="iso_2digit='"+prop2['iso_2digit']+"'";

                 // and set the filter of ecoregion higlighted
                  country_gs_hi.setParams({CQL_FILTER:filter2});
                  hi_highcharts_country(prop2,cou_gs_latlng);

                  // show the div containing graphs and info
                  $( "#block-block-136" ).show();

            }
            else {
              // console.log(' no info')
            }
        }


  }// Close else

}); // Close onclick function

//------------------------------------------------------------------------------
// Country JSON point LAYER - cartodb
//------------------------------------------------------------------------------

var filter_ecoregion = function(feature) {
 return feature.properties.ecoregion_id > 1;
}
var c_cen_group = new L.LayerGroup();
var query_cou_cent = "SELECT * FROM dopa_exp_cou_cent";
var sql_cou_cent = new cartodb.SQL({ user: 'climateadapttst' });
sql_cou_cent.execute(query_cou_cent, null, { format: 'geojson' }).done(function(data_cou_cent) {

      layer_cou_cent = L.geoJson(data_cou_cent, {

                  onEachFeature: function (feature, layer_cou_cent) {
                    //NOTHING BEACUSE THE POPUP IS MANAGED BY THE WMS
                    },
                  pointToLayer: function (feature, latlng) {
                    var geojsonMarkerOptions = {
                    radius:0.001,
                    opacity: 0,
                    fillOpacity: 0
                    };
                    return L.circleMarker(latlng, geojsonMarkerOptions );
                  }
       })//.addTo(lMap);

      c_cen_group.addLayer(layer_cou_cent);
      //   if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      // layer_cou_cent.bringToFront();
      // }

})

//------------------------------------------------------------------------------
// SEARCH country
//------------------------------------------------------------------------------
 var searchcou = L.control.search({
 position:'topleft',
 layer: c_cen_group,
 zoom:7,
 circleLocation: false,
 layer_cou_cent: country_gs_hi,
 textErr: 'Site not found',
 propertyName: 'name_c',
 textPlaceholder: 'Location...                ',
 buildTip: function(text, val) {
 var type = val.layer.feature.properties.iso_2digit;
 return '<a href="#" class="'+type+'"><b>'+text+'</b></a>';
}
}).addTo(lMap);

//------------------------------------------------------------------------------
// country LAYER -  WMS - Geoserver
//------------------------------------------------------------------------------

var url_gs_country = 'http://lrm-maps.jrc.ec.europa.eu/geoserver/dopa_explorer/wms';
var country_gs=L.tileLayer.wms(url_gs_country, {
   layers: 'dopa_explorer:dopa_countries_new_better5',
   transparent: true,
   format: 'image/png',
   opacity:'0.8',
   zIndex: 33
});

//------------------------------------------------------------------------------
//  Country LAYER - Get Feature Info
//------------------------------------------------------------------------------

function getFeatureInfoUrl_c(map, layer, latlng, params) {
 //console.log(layer.wmsParams.layers)
if (layer.wmsParams.layers=="dopa_explorer:dopa_countries_new_better5")
    {
       var point2 = map.latLngToContainerPoint(latlng, map.getZoom()),
           size2 = map.getSize(),
           bounds2 = map.getBounds(),
           sw2 = bounds2.getSouthWest(),
           ne2 = bounds2.getNorthEast();

       var defaultParams2 = {
           request: 'GetFeatureInfo',
           service: 'WMS',
           srs: 'EPSG:4326',
           styles: '',
           version: layer._wmsVersion,
           format: layer.options.format,
           bbox: bounds2.toBBoxString(),
           height: size2.y,
           width: size2.x,
           layers: layer.options.layers,
           info_format: 'text/javascript'
       };

     params = L.Util.extend(defaultParams2, params || {});
     params[params.version === '1.3.0' ? 'i' : 'x'] = point2.x;
     params[params.version === '1.3.0' ? 'j' : 'y'] = point2.y;

     return layer._url + L.Util.getParamString(params, layer._url, true);
    }
}

//------------------------------------------------------------------------------
// LEGEND of COUNTRY LAYER
//------------------------------------------------------------------------------

function getColor(d) {

 return d > 50  ? '#074046' :
        d > 30  ? '#0d585f' :
        d > 20  ? '#287274' :
        d > 15  ? '#63a6a0' :
        d > 10   ? '#89c0b6' :
        d > 5   ? '#b4d9cc' :
        d > 1   ? '#e4f1e1' :
                   '#e4f1e1';
}

var legend = L.control({position: 'bottomleft'});
    legend.onAdd = function (lMap) {
        var div = L.DomUtil.create('div', 'info legend'),
         labels = ['<div id="countrylegend"><p>Country coverage by protected areas (%)</p></div>'],
           grades = [1, 5, 10, 15, 20, 30, 50],
           key_labels = [' 1 % ',' 5 % ',' 10 % ',' 15 % ',' 20 % ',' 30 % ',' 50 % '];
               for (var i = 0; i < grades.length; i++) {
                div.innerHTML += labels.push('<i style="background:' + getColor(grades[i] + 1) + '"></i> ' + key_labels[i] + (key_labels[i + 1] ? '&ndash;' + key_labels[i + 1] + '<br>' : '+'));
               }
           div.innerHTML = labels.join('');
         return div;
      };
legend.addTo(lMap);

//------------------------------------------------------------------------------
//  Country LAYER - HIGHLIGHT WMS
//------------------------------------------------------------------------------

var url_gs_country_hi = 'http://lrm-maps.jrc.ec.europa.eu/geoserver/dopa_explorer/wms';
var country_gs_hi=L.tileLayer.wms(url_gs_country_hi, {
   layers: 'dopa_explorer:dopa_countries_new_better5_hi',
   transparent: true,
   format: 'image/png',
   opacity:'1',
   zIndex: 40
}).addTo(lMap);

country_gs_hi.setParams({CQL_FILTER:"name_c LIKE ''"});

//------------------------------------------------------------------------------
// Counry LAYER - ONCLICK RESPONSE ON HIGLIGHTED ECOREGION
//------------------------------------------------------------------------------
function hi_highcharts_country(info,latlng){

  //create variables of each column you want to show from the attribute table of the country wms - each variable need to be set in under "getfeatureinfourl" function
  var name_c=info['name_c'];
  var iso_2digit=info['iso_2digit'];
  var t_prot_per=info['t_prot_per'];
  var t_pro_area=info['t_pro_area'];
  var t_conn_per=info['t_conn_per'];
  var mar_area=info['mar_area'];
  var m_prot_per=info['m_prot_per'];
  var m_pro_area=info['m_pro_area'];
  var land_area=info['land_area'];

  // country higlighted popup
  var Popup_Content_Country = '<center><i class="fa fa-globe fa-2x" aria-hidden="true"></i><hr><p>'+name_c+'</p><hr><a href="/country/'+iso_2digit+'">SEE REPORT</a></center>';

  $('#container_country_data').highcharts({
    chart: {type:'bar', height: 300, width: 370,
    backgroundColor:'rgba(255, 255, 255, 0)',
  },
    colors: ['#297177', '#128488'],
    title: {text: null},
    subtitle: {
        text: 'Country coverage by protected areas and connectivity (ProtConn)'
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
       color: '#5f5f5f',
       value: '17',
       width: '2',
       zIndex: 12
   }]
},

    series: [	{
              name: '% of Protection',
              data: [parseFloat(Math.round(t_prot_per*100)/100)]
              },
              {
              name: '% of Connectivity',
              data: [parseFloat(Math.round(t_conn_per*100)/100)/2]
              }
            ]

  });



  var popup_cou_gs = L.popup()
       .setLatLng([latlng.lat, latlng.lng])
       .setContent(Popup_Content_Country)
       .openOn(lMap);
       $('#container64').html('<p>Aichi Target 11 treshold (17%)</p><hr>');
       $('#container_country_name').html('<center><a href="/country/'+iso_2digit+'">'+name_c+'</a></center><hr>');
       $('#container_country_info5').html('<span><div class="sdg_terr_pa"><p>Terrestrial Area</p></div><a href="https://sustainabledevelopment.un.org/sdg15"><img border="0" alt="sdg" src="sites/default/files/sdg_terr.png" width="70" height="70"></a><div class="sdg_terr"><p><b>'+ parseFloat(Math.round(t_prot_per*100)/100)+'</b>%</p></div><div class="sdg_terr_pa_cov"><p>Coverage</p></div><div class="sdg_terrt"><p><b>'+ parseFloat(Math.round(t_pro_area*100)/100)+'</b> km2</p></div><div class="sdg_terr_pat_cov"><p>Protected Land Area</p></div><div class="sdg_terrtotal"><p><b>'+ parseFloat(Math.round(land_area*100)/100)+'</b> km2</p></div><div class="sdg_terr_patotal_cov"><p>Total Land Area</p></div></span>');
       $('#container_country_info4').html('<span><div class="sdg_mar_pa"><p>Marine Area</p></div><a href="https://sustainabledevelopment.un.org/sdg14"><img border="0" alt="sdg" src="sites/default/files/sdg_mar.png" width="70" height="70"></a><div class="sdg_mar"><p><b>'+ parseFloat(Math.round(m_prot_per*100)/100)+'</b>%</p></div><div class="sdg_mar_pa_cov"><p>Coverage</p></div><div class="sdg_mart"><p><b>'+ parseFloat(Math.round(m_pro_area*100)/100)+'</b> km2</p></div><div class="sdg_marr_pat_cov"><p>Protected Marine Area</p></div><div class="sdg_terrtotal_mar"><p><b>'+ parseFloat(Math.round(mar_area*100)/100)+'</b> km2</p></div><div class="sdg_mar_patotal_cov"><p>Total Marine Area</p></div></span>');





} // hi_highcharts_country







//------------------------------------------------------------------------------
// WDPA JSON point LAYER - cartodb
//------------------------------------------------------------------------------

var filter_wdpa = function(feature) {
 return feature.properties.wdpaid > 1;
}
var wdpa_group = new L.LayerGroup();
var query4 = "SELECT the_geom, wdpaid, name FROM dopa_carto_wdpa_centroids_master";
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

var url = 'https://lrm-maps.jrc.ec.europa.eu/geoserver/dopa_explorer_2/wms';
var wdpa=L.tileLayer.wms(url, {
    layers: 'dopa_explorer_2:dopa_geoserver_wdpa_master',
    transparent: true,
    format: 'image/png',
    opacity:'1',
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
  return d4 > 30  ?   '#c9d6ce' :
         d4 > 20  ?   '#c9d6ce':
         d4 > 15  ?   '#104f60':
         d4 > 10  ?   '#1c707b':
                      '#80bfd9';
                  }
var legend4 = L.control({position: 'bottomleft'});
legend4.onAdd = function (lMap) {
  var div = L.DomUtil.create('div', 'info legend'),
    labels = ['<div id="wdpalegend"><p> Protected area type</p></div>'],
    grades4 = [10,15,20,30],
    key_labels4 = ['Marine (≥ 50 sqkm)', 'Terrestrial (≥ 50 sqkm)', 'Coastal (≥ 50 sqkm)', 'All (At local scale)'];
    for (var i4 = 0; i4 < grades4.length; i4++) {div.innerHTML += labels.push('<i style="background:' + getColor4(grades4[i4]) + '"></i> ' + ( key_labels4[i4] ? key_labels4[i4] + '<br>' : '+')); }
    div.innerHTML = labels.join('');
    return div;
};
legend4.addTo(lMap);

//------------------------------------------------------------------------------
//  WDPA HIGHLIGHT WMS
//------------------------------------------------------------------------------

var url = 'https://lrm-maps.jrc.ec.europa.eu/geoserver/dopa_explorer_2/wms';
var wdpa_hi=L.tileLayer.wms(url, {
    layers: 'dopa_explorer_2:dopa_geoserver_wdpa_master_hi',
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
  propertyName: 'name',
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
  var popupContentwdpa = '<center><i class="fa fa-envira fa-2x" aria-hidden="true"></i><p>'+name+'</p><i>'+country+'</i><hr><a href="/wdpa/'+wdpaid+'">See Report</a></center>';
  // when available add: <center><i class="fa fa-globe fa-2x" aria-hidden="true"></i><br></br><a href="/country/'+iso3_first+'">'+country+'</a></center><hr>
  }
  else{
  var popupContentwdpa = '<center><i class="fa fa-envira fa-2x" aria-hidden="true"></i><hr><p>'+name+'</p></center>';
  // when available add: <center><i class="fa fa-globe fa-2x" aria-hidden="true"></i><br></br><a href="/country/'+iso3_first+'">'+country+'</a></center><hr>
  }
 var popup = L.popup()
      .setLatLng([latlng.lat, latlng.lng])
      .setContent(popupContentwdpa)
      .openOn(lMap);

    //WDPA HIGLIGHTED HEADER RIGHT BOX

    if (gis_area > 99){
    $('#container8').html('<center><a href="/wdpa/'+wdpaid+'">'+name+'</a><br><b> '+country+' </b></center>');

    } else{
    $('#container8').html('<center><b>'+name+'</b></center>');
    }

    //WDPA higlighted general info bottom-right box
    $('#container2').html( '<div class="popup" onclick="myFunction()"><i class="fa fa-info" aria-hidden="true"></i><span class="popuptext" id="myPopup">Habitat complexity, threatened species and pressures of the protected area versus the average for all protected areas in the country.</span></div>'+
                          '<p><span>Designation &nbsp;</span><b>'+desig_eng+'</b></p>'+
                          '<p><span>Designation Type &nbsp;</span><b>'+desig_type+'</b></p>'+
                          '<p><span>IUCN Category &nbsp;</span><b>'+iucn_cat+'</b></p>'+
                          '<p><span>Reported Area (km²) &nbsp;</span><b>'+parseFloat(Math.round(reported_area*100)/100)+'</b></p>'+
                          '<p><span>Year &nbsp;</span><b>'+status_yr+'</b></p>');
      //WDPA higlighted general info below map
      $('#someinfo').html('<em><span><b>'+name+'</b></span> is in <span><b>'+country+'</b></span>, has been designated as '+desig_eng+' at '+desig_type+' level<em class="year_des"> in <span><b class ="years">'+status_yr+'</b></em></span>, it covers <span><b>'+parseFloat(Math.round(gis_area*100)/100)+' km² </b></span><em class="mang_auth">and is managed by '+mang_auth+'</em></span>.<br><em> ');
      // when is available add: <a href="/country/'+iso3_first+'" class="countrylink" >'+country+'</a>

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
//  WDPA Spyder graph and bottom InfoGraphics
//-----------------------------------------------------------------------------

$.ajax({
  url: url,
  dataType: 'json',
  success: function(d) {
      if (d.metadata.recordCount == 0) {
          jQuery('#container3');
          jQuery('#container3').html('<img src="/sites/default/files/sna.png" alt="Mountain View" style="width:421px;height:242px;">');
          $('#pa_infographics').hide();
      } else {
          var title = [];
          var country_avg = [];
          var site_norm_value = [];
          $('#pa_infographics').show();
          $('#infographic_full_report').html('<a href="/wdpa/'+wdpaid+'">Full Report</a>');

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

                            $('#pa_infographics').show();
                            $('#infographic_agr_title').html('<p>Agriculture</p><i>Country normalized score for the agricultural pressure in the protected area </i>');
                            $('#infographic_bar_wdpa_general_agr').show();
                            $('#infographic_bar_wdpa_agr_').remove();
                            $('#infographic_bar_wdpa_agr_name').remove();
                            $('#infographic_bar_wdpa_general_agr').append('<div id ="infographic_bar_wdpa_agr_" style="width:'+parseInt(data[prop])+'%";></div>').show('slow');
                            $('#infographic_bar_wdpa_general_agr').append('<div id ="infographic_bar_wdpa_agr_name" ><p class="counter" >'+parseInt(data[prop])+'</p></div>').show('slow');
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

                              if(data[prop]>=0){
                              site_norm_value.push(data[prop]);
                              $('#infographic_pop_title').html('<p>Population</p><i>Country normalized score for the population pressure in the protected area /i>');
                              $('#infographic_bar_wdpa_general_pop').show();
                              $('#infographic_bar_wdpa_pop_').remove();
                              $('#infographic_bar_wdpa_pop_name').remove();
                              $('#infographic_bar_wdpa_general_pop').append('<div id ="infographic_bar_wdpa_pop_" style="width:'+parseInt(data[prop])+'%";></div>').show('slow');
                              $('#infographic_bar_wdpa_general_pop').append('<div id ="infographic_bar_wdpa_pop_name" ><p class="counter" >'+parseInt(data[prop])+'</p></div>').show('slow');
                            }
                              else{
                              site_norm_value.push(0);
                              $('#infographic_bar_wdpa_general_pop').append('<div id ="infographic_bar_wdpa_pop_" style="width:0%";></div>').show('slow');
                              $('#infographic_bar_wdpa_general_pop').append('<div id ="infographic_bar_wdpa_pop_name" ><p class="counter">No Data</p></div>').show('slow');
                              $('#infographic_bar_wdpa_pop_').remove();
                              $('#infographic_bar_wdpa_pop_name').remove();
                            }
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
                         $('#infographic_introad_title').html('<p>Internal Roads</p><i>Country normalized score for the internal roads pressure index</i>');
                         $('#infographic_bar_wdpa_general_introad').show();
                         $('#infographic_bar_wdpa_introad_').remove();
                         $('#infographic_bar_wdpa_introad_name').remove();
                         $('#infographic_bar_wdpa_general_introad').append('<div id ="infographic_bar_wdpa_introad_" style="width:'+parseInt(data[prop])+'%";></div>').show('slow');
                         $('#infographic_bar_wdpa_general_introad').append('<div id ="infographic_bar_wdpa_introad_name" ><p class="counter">'+parseInt(data[prop])+'</p></div>').show('slow');
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
                            $('#infographic_eroad_title').html('<p>Surrounding Roads</p><i>Country normalized score for the external roads pressure outside the protected area (30km buffer)</i>');
                            $('#infographic_bar_wdpa_general_eroad').show();
                            $('#infographic_bar_wdpa_eroad_').remove();
                            $('#infographic_bar_wdpa_eroad_name').remove();
                            $('#infographic_bar_wdpa_general_eroad').append('<div id ="infographic_bar_wdpa_eroad_" style="width:'+parseInt(data[prop])+'%";></div>').show('slow');
                            $('#infographic_bar_wdpa_general_eroad').append('<div id ="infographic_bar_wdpa_eroad_name" ><p class="counter">'+parseInt(data[prop])+'</p></div>').show('slow');
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
                            $('#infographic_amph_title').html('<p>Amphibians</p><i>Country normalized score for the theoretical presence of amphibians in the protected area </i>');
                            $('#infographic_bar_wdpa_general_amph').show();
                            $('#infographic_bar_wdpa_amph_').remove();
                            $('#infographic_bar_wdpa_amph_name').remove();
                            $('#infographic_bar_wdpa_general_amph').append('<div id ="infographic_bar_wdpa_amph_" style="width:'+parseInt(data[prop])+'%";></div>').show('slow');
                            $('#infographic_bar_wdpa_general_amph').append('<div id ="infographic_bar_wdpa_amph_name" ><p class="counter">'+parseInt(data[prop])+'</p></div>').show('slow');
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
                            $('#infographic_mammals_title').html('<p>Mammals</p><i>Country normalized score for the theoretical presence of mammals in the protected area </i>');
                            $('#infographic_bar_wdpa_general_mammals').show();
                            $('#infographic_bar_wdpa_mammals_').remove();
                            $('#infographic_bar_wdpa_mammals_name').remove();
                            $('#infographic_bar_wdpa_general_mammals').append('<div id ="infographic_bar_wdpa_mammals_" style="width:'+parseInt(data[prop])+'%";></div>').show('slow');
                            $('#infographic_bar_wdpa_general_mammals').append('<div id ="infographic_bar_wdpa_mammals_name" ><p class="counter">'+parseInt(data[prop])+'</p></div>').show('slow');

                              if(data[prop]>=0)
                              site_norm_value.push(data[prop]);
                              // $('#infographic_bar_wdpa_general_mammals').html('<center>ssss</center>');
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
                            $('#infographic_birds_title').html('<p>Birds</p><i>Country normalized score for the theoretical presence of bird in the protected area</i>');
                            $('#infographic_bar_wdpa_general_birds').show();
                            $('#infographic_bar_wdpa_birds_').remove();
                            $('#infographic_bar_wdpa_birds_name').remove();
                            $('#infographic_bar_wdpa_general_birds').append('<div id ="infographic_bar_wdpa_birds_" style="width:'+parseInt(data[prop])+'%";></div>').show('slow');
                            $('#infographic_bar_wdpa_general_birds').append('<div id ="infographic_bar_wdpa_birds_name" ><p class="counter">'+parseInt(data[prop])+'</p></div>').show('slow');
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

                              if(data[prop]>=0){
                              site_norm_value.push(data[prop]);
                              $('#infographic_popc_title').html('<p>Population Change</p><i>Protected area normalized score of the change in population density pressure index</i>');
                              $('#infographic_bar_wdpa_general_popc').show();
                              $('#infographic_bar_wdpa_popc_').remove();
                              $('#infographic_bar_wdpa_popc_name').remove();
                              $('#infographic_bar_wdpa_general_popc').append('<div id ="infographic_bar_wdpa_popc_" style="width:'+parseInt(data[prop])+'%";></div>').show('slow');
                              $('#infographic_bar_wdpa_general_popc').append('<div id ="infographic_bar_wdpa_popc_name" ><p class="counter">'+parseInt(data[prop])+'</p></div>').show('slow');
                            }
                              else{
                              site_norm_value.push(0);
                              $('#infographic_bar_wdpa_general_popc').append('<div id ="infographic_bar_wdpa_popc_" style="width:0%";></div>').show('slow');
                              $('#infographic_bar_wdpa_general_popc').append('<div id ="infographic_bar_wdpa_popc_name" ><p class="counter">No Data</p></div>').show('slow');
                              $('#infographic_bar_wdpa_popc_').remove();
                              $('#infographic_bar_wdpa_popc_name').remove();
                            }
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
                              title.push("Habitat Diversity")
                          }
                          else if (prop == 'country_avg') {
                              if(data[prop]>=0)
                              country_avg.push(data[prop]);
                              else
                              country_avg.push(0);
                          }
                          else if (prop == 'site_norm_value') {

                              if(data[prop]>=0){
                              site_norm_value.push(data[prop]);
                              $('#infographic_hdi_title').html('<p>Number of distinct habitats ≥ 10 km2</p><i>Country normalized score for the habitat diversity in the protected area </i>');
                              $('#infographic_bar_wdpa_general_hdi').show();
                              $('#infographic_bar_wdpa_hdi_').remove();
                              $('#infographic_bar_wdpa_hdi_name').remove();
                              $('#infographic_bar_wdpa_general_hdi').append('<div id ="infographic_bar_wdpa_hdi_" style="width:'+parseInt(data[prop])+'%";></div>').show('slow');
                              $('#infographic_bar_wdpa_general_hdi').append('<div id ="infographic_bar_wdpa_hdi_name" ><p class="counter">'+parseInt(data[prop])+'</p></div>').show('slow');
                            }
                              else{
                              site_norm_value.push(0);
                              $('#infographic_bar_wdpa_general_hdi').append('<div id ="infographic_bar_wdpa_hdi_" style="width:0%";></div>').show('slow');
                              $('#infographic_bar_wdpa_general_hdi').append('<div id ="infographic_bar_wdpa_hdi_name" ><p class="counter">No Data</p></div>').show('slow');
                              $('#infographic_bar_wdpa_hdi_').remove();
                              $('#infographic_bar_wdpa_hdi_name').remove();
                            }
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
               backgroundColor:'rgba(255, 255, 255, 0)',
                  polar: true,
                   height: 365,
                   width: 420,
              },

              title: {
                  text: null
              },
              subtitle: {
                  text: ""
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
                              s.push('<span style="color:rgb(130, 162, 145);font-weight:bold;">'+ point.series.name +' : '+
                              point.y +'<span>');
                          }
                          else{
                              s.push('<span style="color:#184c52;">'+ point.series.name +' : '+
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
                  color: '#79a6ab'
              },
              {
                  type: 'line',
                  marker: {
                      enabled: true
                  },
                  name: 'Protected Area',
                  data: site_norm_value,
                  color: '#184c52'
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
      $( "#block-block-136" ).hide();
    })

//---------------------------------------------------------------
// OPENSTREETMAP SEARCH
//---------------------------------------------------------------
 //   var searchlocation = L.control.search({
 //   url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
 //   jsonpParam: 'json_callback',
 //   propertyName: 'display_name',
 //   propertyLoc: ['lat','lon'],
 //   markerLocation: false,
 //   autoType: true,
 //   textPlaceholder: 'Location...                ',
 //   zoom:5,
 //   minLength: 2,
 //   position:'topright'
 // }).addTo(lMap);
//----------------------------------------------------------------
// Layers
//----------------------------------------------------------------
   var baseMaps = {
        "Light": streets,
        "Landscape": grayscale
    };
   var overlayMaps = {
        'PROTECTED AREAS':wdpa,
        'COUNTRIES':country_gs,
        'Ecoregion':ecoregion

    };
//---------------------------------------------------------------------
// add remove layers
//----------------------------------------------------------------------
$(".patopwdpa").click(function(event) {
 event.preventDefault();
 if (lMap.hasLayer(wdpa)) {

      lMap.removeLayer(wdpa_group);
      $(".patopwdpa").css('background-color', '#f6f6f6').css('color', '#1a626b');
      $(".patopecoregion").css("background-color", '#fff').css('color', '#2e424a');
      $(".patopcountry").css('background-color', '#fff').css('color', '#2e424a');

 }
 else {
      lMap.addLayer(wdpa);
      lMap.addLayer(wdpa_hi);
      lMap.addLayer(wdpa_group);
      lMap.removeLayer(country_gs_hi);
      lMap.removeLayer(country_gs);

      lMap.removeLayer(eco_hi);
      lMap.removeLayer(ecoregion);
      $('#block-block-128').hide();
      lMap.closePopup();
      $(".patopwdpa").css('background-color', '#f6f6f6').css('color', '#1a626b');
      $(".patopecoregion").css("background-color", '#fff').css('color', '#2e424a');
      $(".patopcountry").css('background-color', '#fff').css('color', '#2e424a');
 }
});

$(".patopcountry").click(function(event) {
 event.preventDefault();
 if (lMap.hasLayer(country_gs)) {

   $(".patopecoregion").css('background-color', '#fff').css('color', '#2e424a');
   $(".patopcountry").css('background-color', '#f6f6f6').css('color', '#2e424a');
   $(".patopwdpa").css('background-color', '#fff').css('color', '#2e424a');

 } else {
   lMap.removeLayer(eco_hi);
      lMap.addLayer(country_gs);
      lMap.addLayer(country_gs_hi);
      lMap.removeLayer(wdpa_group);

      lMap.removeLayer(ecoregion);
      lMap.removeLayer(wdpa);
      lMap.removeLayer(wdpa_hi);
      lMap.closePopup();

      $("#someinfo").hide();
      $( "#block-block-127" ).hide();
      $( "#block-block-128" ).hide();
      $(".patopwdpa").css('background-color', '#fff').css('color', '#2e424a');
      $(".patopecoregion").css("background-color", '#fff').css('color', '#2e424a');
      $(".patopcountry").css('background-color', '#f6f6f6').css('color', '#1a626b');
      $('#pa_infographics').hide();

 }
});


$(".patopecoregion").click(function(event) {
 event.preventDefault();
 if (lMap.hasLayer(ecoregion)) {

      $(".patopecoregion").css('background-color', '#f6f6f6').css('color', '#2e424a');
      $(".patopcountry").css('background-color', '#fff').css('color', '#2e424a');
      $(".patopwdpa").css('background-color', '#fff').css('color', '#2e424a');

 } else {
      lMap.addLayer(ecoregion);
      lMap.addLayer(eco_hi);
      lMap.addLayer(eco_group);

      lMap.removeLayer(country_gs);
            lMap.removeLayer(country_gs_hi);
      lMap.removeLayer(wdpa);
      lMap.removeLayer(wdpa_group);
      lMap.removeLayer(wdpa_hi);
      lMap.closePopup();

      $("#someinfo").hide();
      $( "#block-block-127" ).hide();
      $( "#block-block-136" ).hide();
      $(".patopecoregion").css('background-color', '#f6f6f6').css('color', '#1a626b');
      $(".patopcountry").css('background-color', '#fff').css('color', '#2e424a');
      $(".patopwdpa").css('background-color', '#fff').css('color', '#2e424a');
        $('#pa_infographics').hide();
 }
});


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
                country_gs.setOpacity(sliderVal/100);
            });
            if (sliderVal) {
                $('#rangeSlider2').bootstrapSlider('setValue', sliderVal);
            }
    });
        function rangeSlider(sliderVal) {
         country_gs.setOpacity(sliderVal)
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


// end of the script
})

})(jQuery);
