

(function($) {
 $(document).bind('leaflet.map', function(e, map, lMap)
   {
     lMap.spin(true);
     lMap.scrollWheelZoom.disable();
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
//---------------------------------------------------------------
// BASE LAYERS
//---------------------------------------------------------------
     var mbAttr = '', mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw';
     var streets  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr}).addTo(lMap);
     var grayscale2   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr});//.addTo(lMap);
     var grayscale  = L.tileLayer('https://api.mapbox.com/styles/v1/lucageo/civark4b600502img5xm0ou4p/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibHVjYWdlbyIsImEiOiJjaXIwY2FmNHAwMDZ1aTVubmhuMDYyMmtjIn0.1jWhLwVzKS6k1Ldn-bVQPg');

 lMap.setView([20, 0], 3);
//---------------------------------------------------------------
// CARTO COUNTRY Legend
//---------------------------------------------------------------
     function getColor(d) {
       return d > 500000000   ? '#126597' :
              d > 100000000   ? '#2E7AA7' :
              d > 50000000    ? '#4A8FB8' :
              d > 25000000    ? '#67A4C9' :
              d > 10000000    ? '#83B9D9' :
              d > 1000000     ? '#9FCEEA' :
              d > 500000      ? '#BCE3FB' ://else
                                '#fff';
     }
    var legend = L.control({position: 'bottomleft'});
    legend.onAdd = function (lMap) {
        var div = L.DomUtil.create('div', 'info legend'),
         labels = ['<div id="countrylegend"><p>Country Protection</p></div>'],
           grades = [500000, 1000000, 10000000, 25000000, 50000000, 100000000, 500000000],
           key_labels = [' 0.5 M ',' 1.0 M ',' 10.0 M ',' 25.0 M ',' 50.0 M ',' 100.0 M ',' 500.0 M '];
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
       fillColor: getColor(feature.properties.sum_budget),
       weight: 1,
       opacity: 1,
       color: 'white',
       dashArray: '3',
       fillOpacity: 0.7,
       zIndex: 1
     }
   }
//---------------------------------------------------------------
// CARTO COUNTRY LAYER SETUP
//---------------------------------------------------------------
    // function we can use to filter what data is added to the GeoJSON layer
     var filter = function(feature) {
       return feature.properties.sum_budget > 0;
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
              layer.bindPopup('<center><i class="fa fa-globe fa-4x" aria-hidden="true"></i><p>COUNTRY </p><hr><a href="/country/'+feature.properties.iso2_mod+'">'+feature.properties.adm0_name+'</a></center><br><i class="fa fa-usd" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp; FUNDING (USD) <b>&nbsp;&nbsp;&nbsp;'+((feature.properties.sum_budget)/1000000)+' M</b><hr><i class="fa fa-cog" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;PROJECTS <b>&nbsp;&nbsp;&nbsp;'+feature.properties.project_numb);
              layer.on({
                 mouseover: highlightFeature,
                 mouseout: resetHighlight,
                 click: zoomToFeature
              });
          }
      }

   var Country_layer = L.geoJson(null, {
     filter: filter,
     onEachFeature: onEachFeature,
     style: stylecou
   });//.addTo(lMap);
   var query = "SELECT * FROM projects";
   var sql = new cartodb.SQL({ user: 'climateadapttst' });
   sql.execute(query, null, { format: 'geojson' }).done(function(data) {//console.log(data);
      Country_layer.addData(data);
   });

   //--------------------------------------------------------------------------------------------------------------------
   //TERRESTRIAL ECOREGION LAYER GEOJSON - POPUP
   //--------------------------------------------------------------------------------------------------------------------

   	function pop_ecoregion_layer(feature, layer) {

   	var popupContent1 = '<center><a href="/ecoregion/'+feature.properties.ecoregion0+'">'+feature.properties.ecoregion_+'</a></center><hr>';

   	var t=function()
   	{

   	  return [	{
   							name: 'Connectivity',

   						    data: [parseFloat(Math.round(feature.properties.tojson_p_2*100)/100)]
                           },
   						{
   							name: 'Protection',
                               data: [parseFloat(Math.round(feature.properties.tojson_p_3*100)/100)]
                           }
   					]
   	}

           layer.on('popupopen', function(e) {

             $('#container4').highcharts({
               chart: {type:'bar', height: 300, width: 370},
               colors: ['#c9db72', '#5b8059'],
               title: {text: null},
               subtitle: {
                   text: 'ECOREGION PROTECTION CONNECTIVITY'
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

               series: t(feature)

             });
              $('#container5').html('<center><a href="/ecoregion/'+feature.properties.ecoregion0+'">'+feature.properties.ecoregion_+'</a></center><hr>');
              $('#container6').html('<hr><p>BIOME <b>'+feature.properties.biome+'</b></p><hr>');
              $('#container7').html('<p>REALM <b>'+feature.properties.realm+'</b></p><hr>');
           });


       layer.on('popupclose', function(e){
         $('#container4').html("");
       });
   				 layer.on({
                mouseover: highlightFeatureeco,
                mouseout: resetHighlighteco,
     			     'click': function (e) {
     				         select(e.target);
     				          }
     			            });

   	layer.bindPopup(popupContent1);

   	}


   //---------------------------------------------------------------
   // CARTO ECOREGION Legend
   //---------------------------------------------------------------
        function getColoreco(deco) {
          return deco > 50       ? '#10732f' :
                 deco > 17       ? '#1a9641' :
                 deco > 12       ? '#a6d96a' :
                 deco > 8        ? '#ffffbf' :
                 deco > 5        ? '#fdae61' :
                 deco > 2        ? '#e77f80' :
                 deco > 0        ? '#ec3a3c' ://else
                                   '#ec3a3c';
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
    // style function for styling the GeoJSON layer, uses getColoreco function above
      var styleeco = function(feature) {
        return {
          fillColor: getColoreco(feature.properties.tojson_p_3),
          weight: 1,
          opacity: 1,
          color: getColoreco(feature.properties.tojson_p_3),
          //dashArray: '3',
          fillOpacity: 0.6,
          zIndex: 1
        }
      }
   //---------------------------------------------------------------
   // CARTO ECOREGION LAYER SETUP
   //---------------------------------------------------------------
       // function we can use to filter what data is added to the GeoJSON layer
        var filtereco = function(feature) {
          return feature.properties.ecoregion0 > 0;
        }
        // function highlight
        function highlightFeatureeco(e) {
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
        function resetHighlighteco(e) {
          Ecoregion_layer.resetStyle(e.target);
        }
        // function zoom to feature
        function zoomToFeatureeco(e) {
          lMap.fitBounds(e.target.getBounds());
        }
    //---------------------------------------------------------------
    // CARTO ECOREGION LAYER
    //---------------------------------------------------------------
         var onEachFeatureeco = function(feature, layer) {
              if (feature.properties) {

                pop_ecoregion_layer(feature,layer);

                layer.on({
                     mouseover: highlightFeatureeco,
                     mouseout: resetHighlighteco,
          			     'click': function (e) {
          				         select(e.target);
                           $( "#block-block-128" ).show();

                       //zoomToFeatureeco(e);
                     }
          			});
             }
         }

      var Ecoregion_layer = L.geoJson(null, {
      //  filter: filtereco,
        onEachFeature: onEachFeatureeco, pop_ecoregion_layer,
        style: styleeco
      });
      var queryeco = "SELECT * FROM eco_prot_final_simp";
      var sqleco = new cartodb.SQL({ user: 'climateadapttst' });
      sqleco.execute(queryeco, null, { format: 'geojson' }).done(function(dataeco) {//console.log(data);
         Ecoregion_layer.addData(dataeco);
      });
//-----------------------------------------------------------------------------------------------------


  //   	var Ecoregion_search = new L.control.search({
  //   	position:'topright',
  //   	layer: Ecoregion_layer,
  //   	zoom:5,
  //   	textErr: 'Site not found',
  //   	propertyName: 'ecoregion_',
  //   	textPlaceholder: 'Ecoregion name...          ',
  //   	buildTip: function(text, val) {
  //   	return '<b>'+text+'</b>';
  //   }
  // }).addTo(lMap)


      //--------------------------------------------------------------------------------------------------------------------
      //TERRESTRIAL wdpa LAYER GEOJSON - POPUP
      //--------------------------------------------------------------------------------------------------------------------

       function pop_wdpa_layer(feature, wdpa_layer) {
         wdpa_layer.on('popupopen', function(e) {
           $('#container8').html('<center><a href="/wdpa/'+feature.properties.wdpaid+'">'+feature.properties.pa_name+'</a></center>');
         });

       var popupContentwdpa = '<center><a href="/wdpa/'+feature.properties.wdpaid+'">'+feature.properties.pa_name+'</a></center><hr>';
       var url = 'http://dopa-services.jrc.ec.europa.eu/services/ibex/ehabitat/get_radarplot_pa?wdpaid=' + feature.properties.wdpaid;
       var urlclima = 'http://dopa-services.jrc.ec.europa.eu/services/ibex/ehabitat/get_climate_pa?wdpaid=' + feature.properties.wdpaid;


          wdpa_layer.on('popupclose', function(e){
            $('#container3').html("");
          });
              wdpa_layer.on({
                  // mouseover: highlightFeatureeco,
                  // mouseout: resetHighlighteco,
                  'click': function (e, feature, wdpa_layer) {
                        select(e.target);

                        $.ajax({
                            url: url,
                            dataType: 'json',
                            success: function(d) {
                                if (d.metadata.recordCount == 0) {
                                    jQuery('#container3');
                                    jQuery('#container3').append('There is no summary data for this WDPA');
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
                                            enabled: false,
                                            text: null,
                                          //  href: 'http://ehabitat-wps.jrc.ec.europa.eu/dopa_explorer/?pa='+$paid
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
                            },
                            // error: function() {
                            //     jQuery('#spider-chart.rest-good').switchClass( "rest-good", "alert alert-warning", 100 );
                            //     jQuery('#spider-chart').append('The climate services are unavailable at the moment.')
                            // }




                        });
                     //zoomToFeatureeco(e);

//---------------------------------------------------------------------barchart----------------------------------------------
setTimeout(function(){
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


          $('#container2').highcharts({
              chart: {
                  zoomType: 'xy',
      // height: 400,
//                   width: 500
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
          });
        }
    },
    // error: function() {
    //     jQuery('#spider-chart.rest-good').switchClass( "rest-good", "alert alert-warning", 100 );
    //     jQuery('#spider-chart').append('The climate services are unavailable at the moment.')
    // }




});
}, 200);
               }
             });

       wdpa_layer.bindPopup(popupContentwdpa);

       }

//---------------------------------------------------------------
// CARTO WDPA POINTS LAYER
//---------------------------------------------------------------

//omnivore.topojson('http://climateadapttst.cartodb.com/api/v2/sql?q=SELECT * from eco_prot_final_simp&format=topojson').addTo(lMap);

// L.TopoJSON = L.GeoJSON.extend({
//   addData: function(jsonData) {
//     if (jsonData.type === "Topology") {
//       for (key in jsonData.objects) {
//         geojson = topojson.feature(jsonData, jsonData.objects[key]);
//         L.GeoJSON.prototype.addData.call(this, geojson);
//       }
//     }
//     else {
//       L.GeoJSON.prototype.addData.call(this, jsonData);
//     }
//   }
// });
//
// $.getJSON('/sites/all/modules/fewo_map/js/country_maps/ecoregion_simple.json')
//   .done(addTopoData);
//
// function addTopoData(topoData){
//   //TopoJSON object
//
// var topoLayer = new L.TopoJSON();
//   topoLayer.addData(topoData);
//   console.warn(topoData);
//
//   //topoLayer.eachLayer(apply_on_feature_topo);
//  topoLayer.addTo(lMap);
//   // lMap.fitBounds(topoLayer.getBounds());
//
// }


//---------------------------------------------------------------

   var filter_wdpa = function(feature) {
     return feature.properties.id > 1;
   }
   var wdpa_group = new L.LayerGroup();
   var query4 = "SELECT * FROM wdpa_centroid_relevant_1606_export_2";
   var sql4 = new cartodb.SQL({ user: 'climateadapttst' });
   sql4.execute(query4, null, { format: 'geojson' }).done(function(data4) { //console.log(data4);

          var wdpa_layer = L.geoJson(data4, {
              filter: filter_wdpa,
                onEachFeature: function (feature, wdpa_layer) {
                  pop_wdpa_layer(feature,wdpa_layer);
                  wdpa_layer.on({
                      // mouseover: highlightFeatureeco,
                      // mouseout: resetHighlighteco,
            			     'click': function (e) {
            				         select(e.target);
                             //console.info(e.target)
                             var name=e.target.feature.properties.pa_name;
                             var wdpaid=e.target.feature.properties.wdpaid;
                            //  jQuery('.leaflet-control-search input').val(name)
                            //  jQuery('.search-button')[0].click();
                            var filter="wdpaid='"+wdpaid+"'";
                          //  console.log(filter)
                             wdpa_hi.setParams({CQL_FILTER:filter});

                             $( "#block-block-127" ).show();
                         //zoomToFeatureeco(e);
                       }
            			});
                },
               pointToLayer: function (feature, latlng) {
                 var geojsonMarkerOptions = {
                     radius: 20,
                     fillColor: "#22a6f5",
                     color: "#22a6f5",
                     weight: 1,
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
  })
  .done(function(data4) {
    lMap.spin(false);
  });
//---------------------------------------------------------------
// WDPA WMS GEOSERVER LAYER
//---------------------------------------------------------------

var url = 'http://h05-prod-vm11.jrc.it/geoserver/conservationmapping/wms';
var wdpa=L.tileLayer.wms(url, {
    layers: 'conservationmapping:pa_50_2017',
    transparent: true,
    format: 'image/png',
opacity:'0.4',
zIndex: 33 // Use zIndex to order the tileLayers within the tilePane. The higher number, the upper vertically.
 }).addTo(lMap);
  // var url = 'http://h05-prod-vm11.jrc.it/geoserver/conservationmapping/wms';
  //var wdpa=L.tileLayer.betterWms(url, {
/*  var wdpa=L.WMS.source(url, {
      // layers: '',
       transparent: true,
       format: 'image/png',
   opacity:'0.4',
   zIndex: 33 // Use zIndex to order the tileLayers within the tilePane. The higher number, the upper vertically.
 });//.addTo(lMap);

 wdpa.getLayer("conservationmapping:pa_50_2017").addTo(lMap);


    var MySource = L.WMS.Source.extend({
    'ajax': function(url, callback) {
        $.ajax(url, {
            'context': this,
            'success': function(result) {
                callback.call(this, result);
             }
        });
    },
    'showFeatureInfo': function(latlng, info) {
      //  $('.output').html(info);
      console.info(info)
    }
});
*/
//---------------------------------------------------------------
// WDPA WMS LEGEND
//---------------------------------------------------------------
function getColor4(d4) {
   return d4 > 25000000  ? '#0D7248' :'#fff';
}
  var legend4 = L.control({position: 'bottomleft'});

  legend4.onAdd = function (lMap) {

   var div = L.DomUtil.create('div', 'info legend'),
        labels = ['<div id="wdpalegend"><p> Legend</p></div>'],
        grades4 = [25000000],
        key_labels4 = ['Protected Area'];

   // loop through our density intervals and generate a label with a colored square for each interval
   for (var i4 = 0; i4 < grades4.length; i4++) {
       div.innerHTML +=
    labels.push(
           '<i style="background:' + getColor4(grades4[i4] + 1) + '"></i> ' +
           key_labels4[i4] + (key_labels4[i4 + 1] ? '' + key_labels4[i4 + 1] + '<br>' : ''));
   }
   div.innerHTML = labels.join('');
   return div;
};
legend4.addTo(lMap);

//---------------------------------------------------------------
//  WDPA HIGLIGWMS SETUP
//--------------------------------------------------------------

      var url = 'http://h05-prod-vm11.jrc.it/geoserver/conservationmapping/wms';
      var wdpa_hi=L.tileLayer.wms(url, {
          layers: 'conservationmapping:pa_50_2017_HIGLIGHT',
          transparent: true,
          format: 'image/png',
      opacity:'1',
      zIndex: 34 // Use zIndex to order the tileLayers within the tilePane. The higher number, the upper vertically.
       }).addTo(lMap);

    wdpa_hi.setParams({CQL_FILTER:"name LIKE ''"}); // GEOSERVER WMS FILTER



    //---------------------------------------------------------------
    // SEARCH WDPA
    //--------------------------------------------------------------
     var searchwdpa = L.control.search({
     position:'topright',
     layer: wdpa_group,
     zoom:9,
     wdpa_layer: wdpa_hi,
     textErr: 'Site not found',
     propertyName: 'pa_name',
     textPlaceholder: 'Protected Area...          ',
     buildTip: function(text, val) {
     var type = val.layer.feature.properties.wdpa_pid;
     return '<a href="#" class="'+type+'"><b>'+text+'</b></a>';
   }
 })
 .addTo(lMap);

 //---------------------------------------------------------------
 // HIGHLIGHT WDPA WHEN CLICK ON LENTE
 //--------------------------------------------------------------

 // $('.search-button').click(function updateParams() {
 //     var x = document.getElementById("searchtext27").value;
 //     console.info(x);
 //     var filter = "name LIKE'" + x + "'";
 //     return wdpa_hi.setParams({CQL_FILTER:filter});
 // });

 //-------------------------------------------------------------------

 lMap.on('click',function(e)
{
  $( "#block-block-128" ).hide();
    $( "#block-block-127" ).hide();

})

lMap.on('popupclose',function(e)
{
 $( "#block-block-128" ).hide();
   $( "#block-block-127" ).hide();

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
    'Ecoregion':Ecoregion_layer,
    };
//------------------------------------------------------------------
// Simple switcher
//-------------------------------------------------------------------
  // var controls = L.control.layers(baseMaps, overlayMaps, {collapsed: false,}).addTo(lMap);









//---------------------------------------------------------------------
// Remove LAYER COUNTRY when wdpa search is activated
//----------------------------------------------------------------------
// $(".search-button").click(function(event) {
//  event.preventDefault();
//     if (lMap.hasLayer(Country_layer)) {
//          lMap.removeLayer(Country_layer);
//          lMap.addLayer(wdpa);
//     } else {}
// });


//--------------------------------------------------------------------------------------------------------------------
// FUNCTION SELECT (TO SHOW THE GRAPH)
//--------------------------------------------------------------------------------------------------------------------
		function select (layer) {

		  if (selected !== null) {

		    var previous = selected;
		  }else {
		  //  $( "#block-block-128" ).show();
		  }
			//lMap.fitBounds(layer.getBounds());
			selected = layer;
		}
		var selected = null;
//---------------------------------------------------------------------
// add remove layers
//----------------------------------------------------------------------
$(".middlewdpa").click(function(event) {
 event.preventDefault();
 if (lMap.hasLayer(wdpa)) {
 lMap.removeLayer(wdpa);
 lMap.removeLayer(wdpa_group);
 } else {
   lMap.addLayer(wdpa);
   lMap.addLayer(wdpa_group);
 }
});

$(".middlecountry").click(function(event) {
 event.preventDefault();
 if (lMap.hasLayer(Country_layer)) {
 lMap.removeLayer(Country_layer);
 lMap.removeLayer(grayscale);
lMap.addLayer(streets);
 } else {
   lMap.addLayer(Country_layer);
   lMap.removeLayer(streets);
 lMap.addLayer(grayscale);
 }
});
$(".middleeco").click(function(event) {
 event.preventDefault();
 if (lMap.hasLayer(Ecoregion_layer)) {
 lMap.removeLayer(Ecoregion_layer);
  lMap.removeLayer(grayscale);
 lMap.addLayer(streets);
 } else {
   lMap.addLayer(Ecoregion_layer);
     lMap.removeLayer(streets);
   lMap.addLayer(grayscale);
 }
});
//-------------------------------------------------------------------------

})

})(jQuery);
