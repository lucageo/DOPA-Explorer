
(function($) {
    $(document).bind('leaflet.map', function(e, map, lMap) {
geoJsonLayer = L.geoJson().addTo(lMap);
		lMap.on('click', getFeatureInfo, lMap);

		function getFeatureInfo(evt){
			ajax_array = [];
			//Lets start by making a list of all the layers that are using WMS on the map
			lMap.eachLayer(function(layer){
			//	if (!layer.options.minZoom){layer.options.minZoom = 0;}

				if (!layer.wmsParams || !layer.wmsParams.makeLayerQueryable || layer.options.minZoom > lMap.getZoom()){
					return
				}
				else{
					var url = getFeatureInfoUrl(evt.latlng, layer);
					//If the layer supports jsonp do it, otherwise use standard json or something else (to support old geoserver)
					if (layer.wmsParams.featureInfoFormat === 'text/javascript'){
						var info;
						var ajax=jQuery.ajax({
							url: url,
							jsonp: false,
							dataType: 'jsonp',
							jsonpCallback: 'parseResponse',
							success:function(data)
							{
								info=data;
							}

						}).done(function(d)
						{
							ajax.info=d;

						});
						ajax_array.push(ajax);

					} else {
						var info;
						var ajax=jQuery.ajax({
							url: url,
							success: function (data, status, xhr) {
								info=data;
								//console.log(data);
								//var err = typeof data === 'string' ? null : data;

							},
							error: function (xhr, status, error) {
								//showGetFeatureInfo(error);
							}
						}).done(function(d)
						{
							//console.log(d)
							ajax.info=d;

						});
						ajax_array.push(ajax);
					}
				}
			});
			$.when.apply($,ajax_array).done(function(){
				var t='';
				for(var i = 0; i < ajax_array.length; i++) {
					var layerResponse = ajax_array[i].info;
					if (layerResponse){t+=showGetFeatureInfo(evt.latlng, layerResponse);}
				}
				makeThePopUp(evt.latlng, t)
			});
		}

		function getFeatureInfoUrl(latlng, CurMapLayer){
			// Construct a GetFeatureInfo request URL given a point
			var point = CurMapLayer._map.latLngToContainerPoint(latlng, CurMapLayer._map.getZoom()),
				size = CurMapLayer._map.getSize(),
				params = {
				  layers: CurMapLayer.wmsParams.layers,
				  query_layers: CurMapLayer.wmsParams.layers,
				  styles: CurMapLayer.wmsParams.styles,
				  service: 'WMS',
				  feature_count: 10,
				  version: CurMapLayer.wmsParams.version,
				  request: 'GetFeatureInfo',
				  bbox: CurMapLayer._map.getBounds().toBBoxString(),
				  height: size.y,
				  width: size.x,
				  format: CurMapLayer.wmsParams.format,
				  info_format: CurMapLayer.wmsParams.featureInfoFormat,
				  srs: 'EPSG:4326',
				};
				if (CurMapLayer.wmsParams.propName){params.PROPERTYNAME = CurMapLayer.wmsParams.propName}
				if (CurMapLayer.wmsParams.formatOptions){params.FORMAT_OPTIONS = CurMapLayer.wmsParams.formatOptions}

			params[params.version === '1.3.0' ? 'i' : 'x'] = point.x;
			params[params.version === '1.3.0' ? 'j' : 'y'] = point.y;

			return CurMapLayer._url + L.Util.getParamString(params, CurMapLayer._url, true);
		}

		function showGetFeatureInfo (latlng, content) {
			var html_outout = " ";
			if (content){



				if (typeof content === 'object'){
					//add a highlight to show what the user selected
					geoJsonLayer.addData(content);
					//it takes the default style for new features, so we have to reset the style each time a feature is added
					geoJsonLayer.setStyle({
						weight: 1,
						opacity: 1,
						color: '#0065a2',
            fillColor: '#000000',
						//dashArray: '5',
						fillOpacity: 0.1
					});
					if (content.features.length == 0){
						//if theres no features on the current layer, skip it
						return '';
					}else{
						for(var i = 0; i < content.features.length; i++) {
							//if there is something, find out what it is and style as needed
							//first get the name of the layer
							var layerName = content.features[i].id;
							layerName = layerName.replace(/\.[^.]*$/g, '' );
							//console.log(content);
							switch(layerName){
								case "mv_wdpa_pa_level_relevant_over50_polygons_country_name_agg":
									var pa_name = content.features[i].properties.wdpa_name;
									var wdpaid = content.features[i].properties.wdpaid;
									var IucnCat = content.features[i].properties.highest_iucn_cat;
									var ReportedArea = content.features[i].properties.jrc_gis_area_km2;
									ReportedArea = ReportedArea.toFixed(2);
									html_outout +=
                                  '<p><a href="/wdpa/' + wdpaid + '">' + pa_name + "</a></p>" +
                                  '<center><i>Management category </i><p>'+IucnCat+'</p></center><hr>';


									break;
								case "eco_mar_ter_prot_con_2016":
									var ecoBiome = content.features[i].properties.biome;
									var ecoConnect = content.features[i].properties.connect;
									var ecoName = content.features[i].properties.eco_name;
									var ecoProtection = content.features[i].properties.protection;
									ecoProtection = ecoProtection.toFixed(2);
									var ecoRelm = content.features[i].properties.realm;
									html_outout += 	'<h5>' + ecoName + "</h5>" +
													'<h6>Relm: ' + ecoRelm + '</h6>' +
													'<h6>Percentage Protected: ' + ecoProtection + '%</h6>';
									break;
								default:
									//If you added a new layer and don't know what's inside.
									console.log('unknown layer name: '+layerName);
									console.log(content.features[i].properties);
									break;
							}
						}
					}
				} else{
					html_outout += 	"This layer did not return json, better check it out";
				}
			}
			if (html_outout == " "){
				return '';
			}
			else{
				// Otherwise show the content in a popup, or something.
				return html_outout;
			}
		}
		function makeThePopUp(latlng, html_outout){
			if (html_outout.length == 0){
				return;
			}
			else{
				L.popup({ maxWidth: 800})
					  .setLatLng(latlng)
					  .setContent(html_outout)
					  .openOn(lMap);
			}

		}

		//this clears the contents of the geojson layer when the pop-up gets closed.
 		lMap.addEventListener('popupclose', function() {geoJsonLayer.clearLayers();}, this);

	})
})(jQuery);






















(function($) {

 $(document).bind('leaflet.map', function(e, map, lMap) {

L.control.scale({position: 'topright'}).addTo(lMap);
//BASEMAPS
var streets  = L.tileLayer('https://api.mapbox.com/styles/v1/lucageo/ciywysi9f002e2snqsz0ukhz4/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibHVjYWdlbyIsImEiOiJjaXIwY2FmNHAwMDZ1aTVubmhuMDYyMmtjIn0.1jWhLwVzKS6k1Ldn-bVQPg').addTo(lMap);
var satellite =  L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
maxZoom: 20,
subdomains:['mt0','mt1','mt2','mt3']
});

// var tree_loss_gain = L.tileLayer('http://earthengine.google.org/static/hansen_2013/loss_forest_gain/{z}/{x}/{y}.png',
// {
//
//   zIndex: 35
//
// }).addTo(lMap);



var occurrence = new L.tileLayer("https://storage.googleapis.com/global-surface-water/maptiles/occurrence/{z}/{x}/{y}.png",
{ format: "image/png",
//  maxZoom: 13,
  zIndex: 35,
  opacity:'1'
//  errorTileUrl : "https://storage.googleapis.com/global-surface-water/downloads_ancillary/blank.png",
//  attribution: "2016 EC JRC/Google"
});
//lMap.addLayer(occurrence);

var transitions = new L.tileLayer("https://storage.googleapis.com/global-surface-water/maptiles/transitions/{z}/{x}/{y}.png",
{ format: "image/png",
//  maxZoom: 13,
  zIndex: 35,
  opacity:'1'
//  errorTileUrl : "https://storage.googleapis.com/global-surface-water/downloads_ancillary/blank.png",
//  attribution: "2016 EC JRC/Google"
});
//lMap.addLayer(transitions);

var change = new L.tileLayer("https://storage.googleapis.com/global-surface-water/maptiles/change/{z}/{x}/{y}.png",
{ format: "image/png",
//  maxZoom: 13,
  zIndex: 35,
  opacity:'1'
//  errorTileUrl : "https://storage.googleapis.com/global-surface-water/downloads_ancillary/blank.png",
//  attribution: "2016 EC JRC/Google"
});

//lMap.addLayer(change);


//-- WDPA WMS GEOSERVER LAYER - SETUP
     var url = 'http://lrm-maps.jrc.ec.europa.eu/geoserver/dopa_explorer/wms';
     var wdpa=L.tileLayer.wms(url, {
         layers: 'dopa_explorer:mv_wdpa_pa_level_relevant_over50_polygons_country_name_agg',
         transparent: true,
         format: 'image/png',
         opacity:'0.6',
         featureInfoFormat: 'text/javascript',
         makeLayerQueryable: true,
         zIndex: 33
      }).addTo(lMap);
        wdpa.setParams({CQL_FILTER:"highest_iucn_cat <> ''"});

      $('#dropwdpa').on('change', function() {
           var highest_iucn_cat = ($('#dropwdpa').val());

            wdpa.setParams({CQL_FILTER:"highest_iucn_cat LIKE '"+highest_iucn_cat+"'"});

            console.info(highest_iucn_cat);
          //  wdpa_hi.setParams({CQL_FILTER:"highest_iucn_cat LIKE '"+highest_iucn_cat+"'"});

         });


//----------------------------------------------------------------
// Layers
//----------------------------------------------------------------
         var baseMaps = {
           'Landscape': streets,
           'Satellite': satellite
          };
         var overlayMaps = {
          //  'water':transitions,
              'PROTECTED AREAS':wdpa

          };
          //----------------------------------------------------------------
          // Layers
          //----------------------------------------------------------------

                    layerControl = L.control.layers(baseMaps, null,  {position: 'bottomright'});
     layerControl.addTo(lMap);


 //--------------------------------------------------------------------------------------------------------
 // Land Cover Change (1995-2015)
 //--------------------------------------------------------------------------------------------------------
setTimeout(function(){
 google.charts.load('current', {'packages':['sankey']});
 google.charts.setOnLoadCallback(drawChart);
 var lcc = [
                [ 'Natural and semi natural land', ' Managed Land', 12.33 ],
                [ 'Natural and semi natural land', ' Mosaic Natural', 11.5 ],
                [ 'Natural and semi natural land', ' Water / Snow and Ice', 0.000001 ],
                [ 'Managed Land', ' Natural and semi natural land', 1.6 ],
                [ 'Managed Land', ' Mosaic Natural', 2.5],
                [ 'Managed Land', ' Water / Snow and Ice', 0.000001 ],
                [ 'Mosaic Natural', ' Natural and semi natural land', 2.3 ],
                [ 'Mosaic Natural', ' Managed Land', 8.6 ],
                [ 'Mosaic Natural', ' Water / Snow and Ice', 0.000001 ],
                [ 'Water / Snow and Ice', ' Natural and semi natural land', 1.9 ],
                [ 'Water / Snow and Ice', ' Mosaic Natural', 3.0 ],
                [ 'Water / Snow and Ice', ' Managed Land', 3.9 ]
           ];


 function drawChart() {
   var data = new google.visualization.DataTable();
   data.addColumn('string', 'From');
   data.addColumn('string', 'To');
   data.addColumn('number', 'Area (km2)');
   data.addRows(lcc);

   // Sets chart options.
   var colors = ['#337465', '#CF3523', '#FFD78B', '#4E93AA','#CF3523','#337465', '#FFD78B', '#4E93AA' ];
//               Forest     _Artifi   _Agricolt    _Water    Artifi     _Forest   Agricolt    Water    (follow the sequence of your classes)
   var options = {
     width: 940,
     sankey: {
        node: {
          colors: colors,
          interactivity: true,
          labelPadding: 2,     // Horizontal distance between the label and the node.
          width: 5,            // Thickness of the node.
          nodePadding: 10     // Vertical distance between nodes.
        },
        link: {
          colorMode: 'gradient',
          colors: colors
        }
      }
   };
   // Instantiates and draws our chart, passing in some options.
   var chart = new google.visualization.Sankey(document.getElementById('sankey_basic'));

   chart.draw(data, options);






 }

    }, 100);


 //--------------------------------------------------------------------------------------------------------
 // water tab
 //--------------------------------------------------------------------------------------------------------


     setTimeout(function(){
         var wdpaid_water_tab = $.trim($('.wdpa-id').text());
     var urlwdpaid_water_tab = 'http://dopa-services.jrc.ec.europa.eu/services/h05ibex/indicators_2017/get_pa_water_stats?pa_id=' + wdpaid_water_tab; //get land cover 2005 in pa

       $.ajax({
               url: urlwdpaid_water_tab,
               dataType: 'json',
               success: function(d) {
                   if (d.metadata.recordCount == 0) {
                   //  jQuery('#elevation_chart_wdpa');
                     jQuery('#water_tab').html('<img src="/sites/default/files/sna2.png" alt="Mountain View">');
                   } else {

                     var perm_now_km2 = [];
                     var seas_now_km2 = [];
                     var net_p_change_km2 = [];
                     var net_s_change_km2 = [];
                     var percent_net_perm_change = [];
                     var percent_net_seas_change = [];

                     var fields = {'perm_now_km2':"",'seas_now_km2':"",'net_p_change_km2':"",'net_s_change_km2':"",'percent_net_perm_change':"",'percent_net_seas_change':""};

                       $(d.records).each(function(i, data) {

                           $('#water_tab tbody').append('<tr id="'+i.toString()+'"></tr>');

                           for (var prop in fields){
                               if(prop == 'perm_now_km2'){
                                   perm_now_km2.push(data[prop]);
                                   //altitude_titles.push("Minimum");
                                   $('#water_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                                   console.log(perm_now_km2);
                               }
                               else if(prop == 'seas_now_km2'){
                                   seas_now_km2.push(data[prop]);
                                   //altitude_titles.push("1st Qtl.");
                                   $('#water_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                               }
                               else if(prop == 'net_p_change_km2'){
                                   net_p_change_km2.push(data[prop]);
                                   //altitude_titles.push("Median");
                                   $('#water_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                               }
                               else if(prop == 'net_s_change_km2'){
                                   net_s_change_km2.push(data[prop]);
                                   //altitude_titles.push("3rd Qtl.");
                                   $('#water_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                               }
                               else if(prop == 'percent_net_perm_change'){
                                   percent_net_perm_change.push(data[prop]);
                                   //altitude_titles.push("Maximum");
                                   $('#water_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                               }
                               else if(prop == 'percent_net_seas_change'){
                                   percent_net_seas_change.push(data[prop]);
                                   //altitude_titles.push("Maximum");
                                   $('#water_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                               }

                           }
                       });

                   }
               },
           });

     }, 300);

     //-----------------------------------------------------------------------------
     // global water graph
     //-----------------------------------------------------------------------------
     setTimeout(function(){
         var wdpaid_water_per = $.trim($('.wdpa-id').text());
     var urlwdpaid_water_per = 'http://dopa-services.jrc.ec.europa.eu/services/h05ibex/indicators_2017/get_pa_water_stats?pa_id=' + wdpaid_water_per; //

     $.ajax({
         url: urlwdpaid_water_per,
         dataType: 'json',
         success: function(d) {
             if (d.metadata.recordCount == 0) {
                // jQuery('#water_per_chart_wdpa');
                // jQuery('#water_per_chart_wdpa').html('<img src="/sites/default/files/sna2.png" alt="Mountain View">');

             } else {


               var perm_now_km2;
               var net_p_change_km2;

               var net_p_1985_km2;

                var seas_now_km2;
                var net_s_change_km2;

                 var net_s_1985_km2;


                 $(d.records).each(function(i, data) {

                          perm_now_km2=data.perm_now_km2;
                          net_p_change_km2=data.net_p_change_km2;
                          net_p_1985_km2 = parseFloat(perm_now_km2)-(parseFloat(net_p_change_km2));

                          seas_now_km2=data.seas_now_km2;
                          net_s_change_km2=data.net_s_change_km2;
                          net_s_1985_km2 = parseFloat(seas_now_km2)-(parseFloat(net_s_change_km2));




                 });

                 $('#water_per_chart_wdpa').highcharts({

                     chart: {
                         type: 'column',
                         zoomType: 'xy',
                         width: 964,
                     },
                     title: {
                         text: null
                     },
                     subtitle: {
                          text: 'Area of Permanent and Seasonal Water'
                     },
                     credits: {
                         enabled: true,
                         text: 'DOPA Services DOPA Services V.2 , WDPA Jan 2017',
                         href: 'http://dopa.jrc.ec.europa.eu'
                     },
                     xAxis: {
                         categories: ['1985', '2015'],
                         //crosshair: true
                     },
                     yAxis: {
                         //min: 0,
                         title: {
                             text: 'Area (km2)'
                         }
                     },
                     tooltip: {

                        // shared: true,
                          headerFormat: '<span style="font-size:12px">{series.name}</span><br>',
             pointFormat: '<span>{point.name}</span> <b>{point.y:.2f}</b> km2 <br/>'

                     },
                     plotOptions: {
                         column: {
                             pointPadding: 0.2,
                             borderWidth: 0
                         }
                     },

                                 series:[{
                                              name: 'Permanent Water',
                                              color: '#22a6f5',
                                              data: [net_p_1985_km2, perm_now_km2 ]
                                          },
                                          {
                                                       name: 'Seasonal  Water',
                                                       color: '#81d0ff',
                                                       data: [net_s_1985_km2, seas_now_km2 ]
                                                   }
                                        ]
                 });
             }
         },

       });

     }, 700);


//-----------------------------------------------------------------------------
// spyder graph threats
//-----------------------------------------------------------------------------
  setTimeout(function(){
    var wdpaid= $('.wdpa-id').text();
  var url = 'http://dopa-services.jrc.ec.europa.eu/services/ibex/ehabitat/get_radarplot_pa?wdpaid=' + wdpaid; // get radar plot in pa

  $.ajax({
    url: url,
    dataType: 'json',
    success: function(d) {
        if (d.metadata.recordCount == 0) {
            jQuery('#spider_chart_wdpa_threats');
            jQuery('#spider_chart_wdpa_threats').html('<img src="/sites/default/files/sna2.png" alt="Mountain View">');
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

                    default:
                        break;
                }

            });

            $('#spider_chart_wdpa_threats').highcharts({
                chart: {
                    polar: true,
                  //  type: 'bar',
                  //  zoomType: 'xy',
                     height: 420,
                     width: 600,
                     //colors: ['#c9db72', '#5b8059']
                },

                title: {
                    text: null
                },
                subtitle: {
                    text: "Threats Summary Data"
                },

                credits: {
                    enabled: true,
                    text: 'DOPA Services V.2 , WDPA Ago 2014',
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
                    color: 'rgb(218,56,39)'
                }]
            });
          }
        }
      });
}, 300);

//-----------------------------------------------------------------------------
// spyder graph species
//-----------------------------------------------------------------------------
  setTimeout(function(){
    var wdpaid= $('.wdpa-id').text();
  var url = 'http://dopa-services.jrc.ec.europa.eu/services/ibex/ehabitat/get_radarplot_pa?wdpaid=' + wdpaid; // get radar plot in pa

  $.ajax({
    url: url,
    dataType: 'json',
    success: function(d) {
        if (d.metadata.recordCount == 0) {
            jQuery('#spider_chart_wdpa_species');
             jQuery('#spider_chart_wdpa_species').html('<img src="/sites/default/files/sna2.png" alt="Mountain View">');
        } else {
            var title = [];
            var country_avg = [];
            var site_norm_value = [];

            $(d.records).each(function(i, data) {

                switch (data.title) {

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

            $('#spider_chart_wdpa_species').highcharts({
                chart: {
                    polar: true,
                  //  type: 'bar',
                  //  zoomType: 'xy',
                     height: 420,
                     width: 600,
                     //colors: ['#c9db72', '#5b8059']
                },

                title: {
                    text: null
                },
                subtitle: {
                    text: "Species Summary Data"
                },

                credits: {
                    enabled: true,
                    text: 'DOPA Services V.2 , WDPA Ago 2014',
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
      });
}, 500);
//-----------------------------------------------------------------------------
//CLIMATE GRAPH
//-----------------------------------------------------------------------------
setTimeout(function(){
   var wdpaid_clima= $('.wdpa-id').text();
var urlclima = 'http://dopa-services.jrc.ec.europa.eu/services/ibex/ehabitat/get_climate_pa?wdpaid=' + wdpaid_clima; // get climate data in pa

         $.ajax({
             url: urlclima,
             dataType: 'json',
             success: function(d) {
                 if (d.metadata.recordCount == 0) {
                     //jQuery('#container2');
                     jQuery('#clima_chart_wdpa').html('<img src="/sites/default/files/sna2.png" alt="Mountain View">');
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
                                       tmin.push(Math.round((data[prop])* 10) / 10)
                               }

                               break;

                           case 'tmax':
                               for (var prop in data) {
                                   if (prop !== 'type' && prop !== 'uom')
                                       tmax.push(Math.round((data[prop])* 10) / 10)
                               }
                               break;

                           case 'tmean':

                               for (var prop in data) {
                                   if (prop !== 'type' && prop !== 'uom')
                                       tmean.push(Math.round((data[prop])* 10) / 10)
                               }
                               break;
                           default:
                               break;
                       }


                   });


                   $('#clima_chart_wdpa').highcharts({
                       chart: {
                           zoomType: 'xy',
                           	width: 964,

                       },
                       legend: {

                       },
                       title: {
                           text: null
                       },
                       subtitle: {
                            text: 'Monthly climate average'
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
                               text: 'Temperature (C°)',
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
                           text: 'WorldClim V.2 , WDPA Jan 2016',
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
}, 600);

//-----------------------------------------------------------------------------
//ELEVATION GRAPH
//-----------------------------------------------------------------------------

setTimeout(function(){
    var wdpaid_el= $('.wdpa-id').text();
var urlelevation = 'http://dopa-services.jrc.ec.europa.eu/services/h05ibex/indicators_2017/get_topostat_pa?wdpaid=' + wdpaid_el;

  $.ajax({
          url: urlelevation,
          dataType: 'json',
          success: function(d) {
              if (d.metadata.recordCount == 0) {
              //  jQuery('#elevation_chart_wdpa');
                jQuery('#elevation_chart_wdpa').html('<img src="/sites/default/files/sna2.png" alt="Mountain View">');
              } else {
                  var altitude = [];
                  //var altitude_titles = [];
                  var average = [];

                  $(d.records).each(function(i, data) {

                      $('#elevation_tab tbody').append('<tr id="'+i.toString()+'"></tr>');

                      for (var prop in data){
                          if(prop == 'min'){
                              altitude.push(data[prop]);
                              //altitude_titles.push("Minimum");
                              $('#elevation_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                          }
                          else if(prop == 'q25'){
                              altitude.push(data[prop]);
                              //altitude_titles.push("1st Qtl.");
                              $('#elevation_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                          }
                          else if(prop == 'median'){
                              altitude.push(data[prop]);
                              //altitude_titles.push("Median");
                              $('#elevation_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                          }
                          else if(prop == 'mean'){
                              average.push(data[prop]);
                              $('#elevation_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                          }
                          else if(prop == 'q75'){
                              altitude.push(data[prop]);
                              //altitude_titles.push("3rd Qtl.");
                              $('#elevation_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                          }
                          else if(prop == 'max'){
                              altitude.push(data[prop]);
                              //altitude_titles.push("Maximum");
                              $('#elevation_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                          }
                      }
                  });


                  $(document).ready(function () {
                       function exportTableToCSV($table, filename) {
                           var $headers = $table.find('tr:has(th)')
                               ,$rows = $table.find('tr:has(td)')
                               ,tmpColDelim = String.fromCharCode(11) // vertical tab character
                               ,tmpRowDelim = String.fromCharCode(0) // null character
                               ,colDelim = '","'
                               ,rowDelim = '"\r\n"';
                               var csv = '"';
                               csv += formatRows($headers.map(grabRow));
                               csv += rowDelim;
                               csv += formatRows($rows.map(grabRow)) + '"';
                               var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
                           $(this)
                               .attr({
                               'download': filename
                                   ,'href': csvData
                                   ,'target' : '_blank' //if you want it to open in a new window
                           });
                           function formatRows(rows){
                               return rows.get().join(tmpRowDelim)
                                   .split(tmpRowDelim).join(rowDelim)
                                   .split(tmpColDelim).join(colDelim);
                           }
                           function grabRow(i,row){

                               var $row = $(row);
                               var $cols = $row.find('td');
                               if(!$cols.length) $cols = $row.find('th');
                               return $cols.map(grabCol)
                                           .get().join(tmpColDelim);
                           }
                           function grabCol(j,col){
                               var $col = $(col),
                                   $text = $col.text();
                               return $text.replace('"', '""'); // escape double quotes
                           }
                       }
                       $(".export_elevation").click(function (event) {
                           var outputFile = window.prompt("Save file in .csv format with the following name:") || 'export';
                           outputFile = outputFile.replace('.csv','') + '.csv'
                           exportTableToCSV.apply(this, [$('#elevation_tab'), outputFile]);
                       });

                      // or substitute with this one if you want to assign the name!
                      //  $(".export_elevation").on('click', function (event) {
                      //      // CSV
                      //      var args = [$('#dvData>table'), 'export.csv'];
                      //
                      //      exportTableToCSV.apply(this, args);
                      //  });
                   });





                  $('#elevation_chart_wdpa').highcharts({
                      chart: {
                          type: 'areaspline',
                          // height: 400,
                          // width: 400
                      },

                      title: {
                          text: null
                      },
                      subtitle: {
                          text: 'Virtual elevation profile'
                      },
                      pane: {
                          size: '100%'
                      },
                      credits: {
                          enabled: true,
                          text: 'DOPA Services V.2 , WDPA Ago 2014',
                          href: 'http://dopa.jrc.ec.europa.eu'
                      },
                      xAxis: {
                          categories: [
                          'Min.',
                          // '1st Quartile',
                          'Median',
                          // '3rd Quartile',
                          'Max.'
                          ]
                      },
                      tooltip: {
                          shared: true,
                          valueSuffix: ' units'
                      },
                      yAxis: {
                          title: {
                              text: 'Elevation (m) above sea level',
                              color: '#3E576F',
                              style: {
                                  color: '#3E576F'
                              }
                          },
                          plotLines: [{
                          color: '#0D6DDF',
                          width: 2,
                          value: average,
                          zIndex:5,
                          label: {
                              text: 'Average: '+average,
                              align: 'right',
                              x: -10
                          }
                          }]
                      },
                      plotOptions: {
                          areaspline: {
                              color: '#679625',
                              //fillOpacity: 1,
                              fillColor: {
                                  linearGradient: [0, 0, 0, 500],
                                  stops: [
                                      [0, '#7ebe25'],
                                      [1, '#fff']
                                  ]
                              }
                          }
                      },
                      series: [{
                          name: 'Altitude',
                          data: altitude
                      }]
                  });
              }
          },
      });

}, 900);
//-----------------------------------------------------------------------------
// clc 2000 graph
//-----------------------------------------------------------------------------
setTimeout(function(){
    var wdpaid_clc2000= $('.wdpa-id').text();
var urlclc2000 = 'http://dopa-services.jrc.ec.europa.eu/services/ibex/ehabitat/get_wdpa_lc_stats_glc2000?wdpaid='+ wdpaid_clc2000;

$.ajax({
    url: urlclc2000,
    dataType: 'json',
    success: function(d) {
        if (d.metadata.recordCount == 0) {
            //jQuery('#clc2000_chart_wdpa');
            jQuery('#clc2000_chart_wdpa').html('<img src="/sites/default/files/sna2.png" alt="Mountain View">');
        } else {
            var obj = {};
            var colors_array = [];
            var obj_array = [];
            var _classif=[];
            $(d.records).each(function(i, data) {
                var lclass = data.lclass;
                obj[lclass] = data;

                    _classif.push(data.label);
                    colors_array.push(data.color);
                    obj_array.push({name: data.label,data:[data.area],percent:data.percent})

            });

            $('#clc2000_chart_wdpa').highcharts({
                colors: colors_array,
                chart: {
                    type: 'column',
                    zoomType: 'xy',
                    width: 964,
                },
                title: {
                    text: null
                },
                subtitle: {
                     text: 'Landcover 2000'
                },
                credits: {
                    enabled: true,
                    text: 'DOPA Services V.2 , WDPA Ago 2014',
                    href: 'http://dopa.jrc.ec.europa.eu'
                },
                xAxis: {
                    categories: _classif,
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Area (km2)'
                    }
                },
                tooltip: {

                   // shared: true,
                     headerFormat: '<span style="font-size:12px">{series.name}</span><br>',
        pointFormat: '<span>{point.name}</span> <b>{point.y:.2f}</b> (km2) <br/>'

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
}, 1200);



//-----------------------------------------------------------------------------
// clc 2005 graph
//-----------------------------------------------------------------------------
setTimeout(function(){

var wdpaid_clc2005= $('.wdpa-id').text();
var urlclc2005 = 'http://dopa-services.jrc.ec.europa.eu/services/ibex/ehabitat/get_wdpa_lc_stats_glob2005?wdpaid=' + wdpaid_clc2005; //get land cover 2005 in pa

$.ajax({
    url: urlclc2005,
    dataType: 'json',
    success: function(d) {
        if (d.metadata.recordCount == 0) {
            jQuery('#clc2005_chart_wdpa');
            jQuery('#clc2005_chart_wdpa').html('<img src="/sites/default/files/sna2.png" alt="Mountain View">');
        } else {

            var obj_array = [];

            $(d.records).each(function(i, data) {

                    obj_array.push({'name': data.label,'value': data.area, 'color': data.color})

            });

            $('#clc2005_chart_wdpa').highcharts({

                chart: {
                    type: 'treemap',
                },
                title: {
                    text: null
                },
                subtitle: {
                     text: 'Landcover 2005'
                },
                credits: {
                    enabled: true,
                    text: 'DOPA Services DOPA Services V.2 , WDPA Ago 2014',
                    href: 'http://dopa.jrc.ec.europa.eu'
                },

                dataLabels: {
                    enabled: false,
                },
                tooltip: {
                     headerFormat: '<span style="font-size:12px">{series.value}</span><br>',
                     pointFormat: '<span>{point.name}</span> <b>{point.value}</b> (km2) <br/>'
                },
                plotOptions: {
                      treemap: {
                                layoutAlgorithm: 'squarified',
                                fillOpacity: 0.3,
                                dataLabels: {enabled: false},
                                borderWidth: 3,
                                borderColor: '#fff',
                                borderOpacity: 0.5
                                }
                            },

               series:  [{data: obj_array}]

          });
        }
     },
  });
}, 1500);


//-----------------------------------------------------------------------------
// Pressure CHARTS
//-----------------------------------------------------------------------------
setTimeout(function(){
jQuery(document).ready(function($) {
    var $paid = $('.wdpa-id').text();
  //  alert ($paid);
    var $paname = $('.wdpa-name').text();
    var $countrynum = $('.country-id').text();
    var $countryname = $('country-name').text();
    var DOPA_REST_URL = 'http://dopa-services.jrc.ec.europa.eu/services/ibex/';
    var serviceNames = {
		'ppi':{
			endpoint: 'ehabitat/get_ppi_country?countryid='+$countrynum,
			indicatorvalue: 'ppi',
			normalisedField:'normalised_ppi',
			normalisedAvgField:'normalised_avg_ppi',
			title:'Population density pressure index',
			ytitle:'Population density pressure',
			color: '#D9D9D9',
			hilite: '#83160a'
		},
		'ppi_change':{
			endpoint: 'ehabitat/get_ppi_change_country?countryid='+$countrynum,
			indicatorvalue: 'percent_change',
			normalisedField:'normalised_ppi_change',
			normalisedAvgField:'normalised_avg_ppi_change',
			title:'Change in population density pressure',
			ytitle:'Change in population density pressure',
			color: '#D9D9D9',
			hilite: '#83160a'
		},
		'ap':{
			endpoint: 'ehabitat/get_agri_pressure_gw_country?countryid='+$countrynum,
			indicatorvalue: 'ap',
			normalisedField:'normalised_ap',
			normalisedAvgField:'normalised_avg_ap',
			title:'Agricultural Pressure index',
			ytitle:'Agricultural pressure',
			color: '#D9D9D9',
			hilite: '#83160a'
		},
		'roads_pressure':{
			endpoint: 'ehabitat/get_roads_pressure_country?countryid='+$countrynum,
			indicatorvalue: 'roads',
			normalisedField:'normalised_roads',
			normalisedAvgField:'normalised_avg_roads',
			title:'External roads pressure index',
			ytitle:'External roads Pressure',
			color: '#D9D9D9',
			hilite: '#83160a'
		},
		'roads_in':{
			endpoint: 'ehabitat/get_internal_roads_pressure_country?countryid='+$countrynum,
			indicatorvalue: 'roads_in',
			normalisedField:'normalised_roads_in',
			normalisedAvgField:'normalised_avg_roads_in',
			title:'Internal roads pressure index',
			ytitle:'Internal roads pressure',
			color: '#D9D9D9',
			hilite: '#83160a'
		}
	};

	function create_chart(param)
	{
		var url=DOPA_REST_URL+serviceNames[param].endpoint;
		return $.ajax({
			url: url,
			dataType: 'json',
			success: function(d) {
				if (d.metadata.recordCount == 0) {
					//jQuery('#country-pressure-chart-'+param);
          jQuery('#country-pressure-chart-'+param).html('<img src="/sites/default/files/sna2.png" alt="Mountain View">');

				} else {
					var wdpa_id = [];
					var indicatorvalue = [];
					var marker_color = [];
					var normalised = [];
					var normalised_avg = [];
					var country_rank = [];

					$(d.records).each(function(i, data) {
						for (var prop in data){
							if(prop == 'wdpa_id'){
                      if (data[prop] == $paid){
                      marker_color.push(serviceNames[param].hilite);
                      }
                      else{
                      marker_color.push(serviceNames[param].color);
                      }
              wdpa_id.push(data[prop]);

							}
							else if(prop == serviceNames[param].indicatorvalue){
								indicatorvalue.push(data[prop]);
							}
							else if(prop == serviceNames[param].normalisedField){
								normalised.push(data[prop]);
							}
							else if(prop == serviceNames[param].normalisedAvgField){
								normalised_avg = data[prop];
							}
							else if(prop == 'country_rank'){
								//country_rank.push(data[prop]);

                    if (data[prop] == country_rank[country_rank.length-1]){

                    country_rank.push(data[prop]+1);
                    }
                    else{
                    country_rank.push(data[prop]);
                  }
                }
							else {
							}
						}
					});

					$('#country-pressure-chart-'+param).highcharts({
						chart: {
							type: 'column',
							height: 350,
							width: 964,
              zoomType: 'xy',
						},
						title: {
							text: null,
						},
						subtitle: {
              text: serviceNames[param].title,

            },
						pane: {size: '100%'},
						credits: {
							enabled: true,
							text: 'DOPA Services V.2 , WDPA Ago 2014',
							href: 'http://ehabitat-wps.jrc.ec.europa.eu/dopa_explorer/?pa='+$paid
						},
						xAxis: {
							title: {
                    text: 'Country Rank',
                    color: '#818181',
                    style: {color: '#818181'}
							},
							categories: country_rank
						},
						tooltip: {
							hideDelay: 500,
							useHTML: true,
							formatter: function() {
								var s = [];
								$.each(this.points, function(i, point) {
										series_id = point.key-1;
										s.push('Country Rank: <b>' + country_rank[series_id]+ '</b><br><span style="font-weight:normal;">WDPA ID: <b>'+ wdpa_id[series_id] + '</b><br>' + point.series.name +': '+
										point.y +'<span><br><a target="_blank" href="/wdpa/'+wdpa_id[series_id]+'">Click to explore this Protected Area</a></span>');

                    // on click func on the charts bars


                       // end of on click func on the charts bars

								});
								return s.join('');
							},
              style: {
                 pointerEvents: 'auto'
               },
							shared: true
						},
						yAxis: {
							title: {
								text: serviceNames[param].ytitle,
								color: '#3E576F',
								style: {color: '#3E576F'}
							},
							min: 0,
							max: 100,
							plotLines: [{
							color: '#f0c5c1',
							width: 1,
							value: normalised_avg,
							zIndex:5,
							label: {
								text: 'Country Average: '+normalised_avg,
                align: 'right',
                x: -10,
                style: {
                    color: '#BBBBBB',
                    fontWeight: 'normal'
                }

							}
							}]
						},
						plotOptions: {
							areaspline: {
								color: '#f0c5c1',
								fillColor: {
									linearGradient: [0, 0, 0, 500],
									stops: [
										[0, '#f0c5c1'],
										[1, '#fff']
									]
								}
							}
						},
						series: [{
							name: serviceNames[param].ytitle,
							type: 'column',
							colorByPoint: true,
							showInLegend: false,
							colors: marker_color,
							data: normalised
						}]
					});
				}
			},
			error: function() {
				jQuery('#country-pressure-chart.'+param);

			}
		});
	}
	create_chart('ppi'),
	create_chart('ppi_change'),
	create_chart('roads_pressure'),
	create_chart('roads_in'),
	create_chart('ap')
});
}, 1900);

//----------------------------------------------------------------------------------------------------------------------------------------------------
//  Tab Species
//----------------------------------------------------------------------------------------------------------------------------------------------------

setTimeout(function(){
    var wdpaid_spec= $('.wdpa-id').text();
var urlspeciesstatus = 'http://dopa-services.jrc.ec.europa.eu/services/h05ibex/especies/get_pa_species_status_stats?format=json&wdpa_id=' + wdpaid_spec;

  $.ajax({
          url: urlspeciesstatus,
          dataType: 'json',
          success: function(d) {
              if (d.metadata.recordCount == 0) {
                // jQuery('#species_status_wdpa');
                jQuery('#species_tab').html('<img src="/sites/default/files/sna2.png" alt="Mountain View">');
              } else {
                   var  _class = [];
                   var  total_species = [];
                   var  threatened = [];
                   var  critically_endangered = [];
                   var  endangered = [];
                   var  vulnerable = [];
                   var  near_threatened = [];
                   var  least_concern = [];
                   var  data_deficient = [];

                  $(d.records).each(function(i, data) {
                    //console.log(data);
                    if (data.class == 'Amphibia'){
                      $('#species_tab tbody').append('<tr id="'+i.toString()+'" class="Amphibia"></tr>');
                    } else if (data.class == 'Mammalia'){
                      $('#species_tab tbody').append('<tr id="'+i.toString()+'" class="Mammalia"></tr>');
                    } else if (data.class == 'Aves'){
                      $('#species_tab tbody').append('<tr id="'+i.toString()+'" class="Aves"></tr>');
                    } else {
                      $('#species_tab tbody').append('<tr id="'+i.toString()+'" class="Other"></tr>');
                    }

                      for (var prop in data){
                          if(prop == 'class'){
                              _class.push(data[prop]);
                              $('#species_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                          }
                          else if(prop == 'total_species'){
                              total_species.push(data[prop]);
                              $('#species_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                          }
                          else if(prop == 'threatened'){
                              threatened.push(data[prop]);
                              $('#species_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                          }
                          else if(prop == 'critically_endangered'){
                              critically_endangered.push(data[prop]);
                              $('#species_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                          }
                          else if(prop == 'endangered'){
                              endangered.push(data[prop]);
                              $('#species_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                          }
                          else if(prop == 'vulnerable'){
                              vulnerable.push(data[prop]);
                              $('#species_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                          }
                          else if(prop == 'near_threatened'){
                              near_threatened.push(data[prop]);
                              $('#species_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                          }
                          else if(prop == 'least_concern'){
                              least_concern.push(data[prop]);
                              $('#species_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                          }
                          else if(prop == 'data_deficient'){
                              data_deficient.push(data[prop]);
                              $('#species_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                          }
                          else {
                            }
                      } // end of for

                  });


                  $(document).ready(function () {
                       function exportTableToCSV($table, filename) {
                           var $headers = $table.find('tr:has(th)')
                               ,$rows = $table.find('tr:has(td)')
                               ,tmpColDelim = String.fromCharCode(11) // vertical tab character
                               ,tmpRowDelim = String.fromCharCode(0) // null character
                               ,colDelim = '","'
                               ,rowDelim = '"\r\n"';
                               var csv = '"';
                               csv += formatRows($headers.map(grabRow));
                               csv += rowDelim;
                               csv += formatRows($rows.map(grabRow)) + '"';
                               var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
                           $(this)
                               .attr({
                               'download': filename
                                   ,'href': csvData
                                   ,'target' : '_blank' //if you want it to open in a new window
                           });
                           function formatRows(rows){
                               return rows.get().join(tmpRowDelim)
                                   .split(tmpRowDelim).join(rowDelim)
                                   .split(tmpColDelim).join(colDelim);
                           }
                           function grabRow(i,row){

                               var $row = $(row);
                               var $cols = $row.find('td');
                               if(!$cols.length) $cols = $row.find('th');
                               return $cols.map(grabCol)
                                           .get().join(tmpColDelim);
                           }
                           function grabCol(j,col){
                               var $col = $(col),
                                   $text = $col.text();
                               return $text.replace('"', '""'); // escape double quotes
                           }
                       }
                       $(".export_species_tab").click(function (event) {
                           var outputFile = window.prompt("Save file in .csv format with the following name:") || 'export';
                           outputFile = outputFile.replace('.csv','') + '.csv'
                           exportTableToCSV.apply(this, [$('#species_tab'), outputFile]);
                       });

                   });
                   // end of export

                } //end of main else

              } // end of sucsess

      }); // ajax call

}, 2200);
//----------------------------------------------------------------------------------------------------------------------------------------------------
//  Lc 2000 tab
//----------------------------------------------------------------------------------------------------------------------------------------------------
setTimeout(function(){
    var wdpaid_lcc2000= $('.wdpa-id').text();
var urllcc2000tab = 'http://dopa-services.jrc.ec.europa.eu/services/h05ibex/ehabitat/get_wdpa_lc_stats_glc2000?format=json&wdpaid=' + wdpaid_lcc2000;

  $.ajax({
          url: urllcc2000tab,
          dataType: 'json',
          success: function(d) {
              if (d.metadata.recordCount == 0) {
                jQuery('#lc2000_tab').html('<img src="/sites/default/files/sna2.png" alt="Mountain View">');
              } else {
                   var label = [];
                   var area = [];
                   var percent = [];
                   var color = [];
                   var fields = {'label':"",'percent':"",'area':"",'color':""};

                  $(d.records).each(function(i, data) {

                      $('#lc2000_tab tbody').append('<tr id="'+i.toString()+'" class="lc2000tr"></tr>');

                      for (var prop in fields){
                          if(prop == 'label'){
                              label.push(data[prop]);
                              $('#lc2000_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                          }
                          else if(prop == 'percent'){
                              percent.push(data[prop]);
                              $('#lc2000_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                          }
                          else if(prop == 'area'){
                              area.push(data[prop]);
                              $('#lc2000_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                          }
                          else if(prop == 'color'){
                              color.push(data[prop]);
                              $('#lc2000_tab tbody tr[id="'+i+'"]').append('<td class="lc2000transpa" style="background-color:'+data[prop]+'!important;"></td>');
                          }

                          else {
                            }
                      } // end of for

                  });
                  $(document).ready(function () {
                       function exportTableToCSV($table, filename) {
                           var $headers = $table.find('tr:has(th)')
                               ,$rows = $table.find('tr:has(td)')
                               ,tmpColDelim = String.fromCharCode(11) // vertical tab character
                               ,tmpRowDelim = String.fromCharCode(0) // null character
                               ,colDelim = '","'
                               ,rowDelim = '"\r\n"';
                               var csv = '"';
                               csv += formatRows($headers.map(grabRow));
                               csv += rowDelim;
                               csv += formatRows($rows.map(grabRow)) + '"';
                               var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
                           $(this)
                               .attr({
                               'download': filename
                                   ,'href': csvData
                                   ,'target' : '_blank' //if you want it to open in a new window
                           });
                           function formatRows(rows){
                               return rows.get().join(tmpRowDelim)
                                   .split(tmpRowDelim).join(rowDelim)
                                   .split(tmpColDelim).join(colDelim);
                           }
                           function grabRow(i,row){

                               var $row = $(row);
                               var $cols = $row.find('td');
                               if(!$cols.length) $cols = $row.find('th');
                               return $cols.map(grabCol)
                                           .get().join(tmpColDelim);
                           }
                           function grabCol(j,col){
                               var $col = $(col),
                                   $text = $col.text();
                               return $text.replace('"', '""'); // escape double quotes
                           }
                       }
                       $(".export_lc2000_tab").click(function (event) {
                           var outputFile = window.prompt("Save file in .csv format with the following name") || 'export';
                           outputFile = outputFile.replace('.csv','') + '.csv'
                           exportTableToCSV.apply(this, [$('#lc2000_tab'), outputFile]);
                       });

                   });
                } //end of main else

              } // end of sucsess

      }); // ajax call

}, 2400);
//----------------------------------------------------------------------------------------------------------------------------------------------------
//  Lc 2005 tab
//----------------------------------------------------------------------------------------------------------------------------------------------------
setTimeout(function(){
  var wdpaid_lcc2005= $('.wdpa-id').text();
  var urllcc2005tab = 'http://dopa-services.jrc.ec.europa.eu/services/h05ibex/ehabitat/get_wdpa_lc_stats_glob2005?format=json&wdpaid=' + wdpaid_lcc2005;

  $.ajax({
          url: urllcc2005tab,
          dataType: 'json',
          success: function(d) {
              if (d.metadata.recordCount == 0) {
                jQuery('#lc2005_tab').html('<img src="/sites/default/files/sna2.png" alt="Mountain View">');
              } else {
                   var label = [];
                   var area = [];
                   var percent = [];
                   var color = [];
                   var fields = {'label':"",'percent':"",'area':"",'color':""};

                  $(d.records).each(function(i, data) {

                      $('#lc2005_tab tbody').append('<tr id="'+i.toString()+'" class="lc2005tr"></tr>');

                      for (var prop in fields){
                          if(prop == 'label'){
                              label.push(data[prop]);
                              $('#lc2005_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                          }
                          else if(prop == 'percent'){
                              percent.push(data[prop]);
                              $('#lc2005_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                          }
                          else if(prop == 'area'){
                              area.push(data[prop]);
                              $('#lc2005_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                          }
                          else if(prop == 'color'){
                              color.push(data[prop]);
                              $('#lc2005_tab tbody tr[id="'+i+'"]').append('<td class="lc2005transpa" style="background-color:'+data[prop]+'!important;"></td>');
                          }

                          else {
                            }
                      } // end of for

                  });
                  $(document).ready(function () {
                       function exportTableToCSV($table, filename) {
                           var $headers = $table.find('tr:has(th)')
                               ,$rows = $table.find('tr:has(td)')
                               ,tmpColDelim = String.fromCharCode(11) // vertical tab character
                               ,tmpRowDelim = String.fromCharCode(0) // null character
                               ,colDelim = '","'
                               ,rowDelim = '"\r\n"';
                               var csv = '"';
                               csv += formatRows($headers.map(grabRow));
                               csv += rowDelim;
                               csv += formatRows($rows.map(grabRow)) + '"';
                               var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
                           $(this)
                               .attr({
                               'download': filename
                                   ,'href': csvData
                                   ,'target' : '_blank' //if you want it to open in a new window
                           });
                           function formatRows(rows){
                               return rows.get().join(tmpRowDelim)
                                   .split(tmpRowDelim).join(rowDelim)
                                   .split(tmpColDelim).join(colDelim);
                           }
                           function grabRow(i,row){

                               var $row = $(row);
                               var $cols = $row.find('td');
                               if(!$cols.length) $cols = $row.find('th');
                               return $cols.map(grabCol)
                                           .get().join(tmpColDelim);
                           }
                           function grabCol(j,col){
                               var $col = $(col),
                                   $text = $col.text();
                               return $text.replace('"', '""'); // escape double quotes
                           }
                       }
                       $(".export_lc2005_tab").click(function (event) {
                           var outputFile = window.prompt("Save file in .csv format with the following name:") || 'export';
                           outputFile = outputFile.replace('.csv','') + '.csv'
                           exportTableToCSV.apply(this, [$('#lc2005_tab'), outputFile]);
                       });

                   });
                } //end of main else

              } // end of sucsess

      }); // ajax call

}, 2600);



//----------------------------------------------------------------------------------------------------------------------------------------------------
//  Species list tab
//----------------------------------------------------------------------------------------------------------------------------------------------------
setTimeout(function(){
  var wdpaid_sp_list= $('.wdpa-id').text();
  var urlsp_list = 'http://dopa-services.jrc.ec.europa.eu/services/h05ibex/especies/get_pa_species_list?format=json&category=EN,CR,VU,NT,LC,EX,EW,DD&taxongroup=all&language1=english&language2=none&wdpa_id=' + wdpaid_sp_list;

  $.ajax({
          url: urlsp_list,
          dataType: 'json',
          success: function(d) {
              if (d.metadata.recordCount == 0) {
                jQuery('#sp_list_tab').html('<img src="/sites/default/files/sna2.png" alt="Mountain View">');
              } else {
                   var  iucn_species_id = [];
                   var  taxon = [];
                   var  kingdom = [];
                   var  phylum = [];
                   var  order = [];
                   var  family = [];
                   var  status = [];
                   var  commonname = [];

                   var fields = {'iucn_species_id':"",'commonname':"",'taxon':"",'kingdom':"",'phylum':"",'order':"",'family':"",'status':""};

                  $(d.records).each(function(i, data) {

                      $('#sp_list_tab tbody').append('<tr id="'+i.toString()+'" class="sp_list_tr"></tr>');

                      for (var prop in fields){
                          if(prop == 'iucn_species_id'){
                              iucn_species_id.push(data[prop]);
                              $('#sp_list_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                          }
                          else if(prop == 'commonname'){
                              commonname.push(data[prop]);
                              $('#sp_list_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                          }
                          else if(prop == 'taxon'){
                              taxon.push(data[prop]);
                              $('#sp_list_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                          }
                          else if(prop == 'kingdom'){
                              kingdom.push(data[prop]);
                              $('#sp_list_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                          }
                          else if(prop == 'phylum'){
                              phylum.push(data[prop]);
                              $('#sp_list_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                          }
                          else if(prop == 'order'){
                              order.push(data[prop]);
                              $('#sp_list_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                          }
                          else if(prop == 'family'){
                              family.push(data[prop]);
                              $('#sp_list_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                          }
                          else if(prop == 'status'){
                              status.push(data[prop]);
                              $('#sp_list_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                          }
                          else {
                          }
                      } // end of for
                  });

                  $(document).ready(function () {
                       function exportTableToCSV($table, filename) {
                           var $headers = $table.find('tr:has(th)')
                               ,$rows = $table.find('tr:has(td)')
                               ,tmpColDelim = String.fromCharCode(11) // vertical tab character
                               ,tmpRowDelim = String.fromCharCode(0) // null character
                               ,colDelim = '","'
                               ,rowDelim = '"\r\n"';
                               var csv = '"';
                               csv += formatRows($headers.map(grabRow));
                               csv += rowDelim;
                               csv += formatRows($rows.map(grabRow)) + '"';
                               var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
                           $(this)
                               .attr({
                               'download': filename
                                   ,'href': csvData
                                   ,'target' : '_blank' //if you want it to open in a new window
                           });
                           function formatRows(rows){
                               return rows.get().join(tmpRowDelim)
                                   .split(tmpRowDelim).join(rowDelim)
                                   .split(tmpColDelim).join(colDelim);
                           }
                           function grabRow(i,row){

                               var $row = $(row);
                               var $cols = $row.find('td');
                               if(!$cols.length) $cols = $row.find('th');
                               return $cols.map(grabCol)
                                           .get().join(tmpColDelim);
                           }
                           function grabCol(j,col){
                               var $col = $(col),
                                   $text = $col.text();
                               return $text.replace('"', '""'); // escape double quotes
                           }
                       }
                       $(".export_species_list_tab").click(function (event) {
                           var outputFile = window.prompt("Save file in .csv format with the following name:") || 'export';
                           outputFile = outputFile.replace('.csv','') + '.csv'
                           exportTableToCSV.apply(this, [$('#sp_list_tab'), outputFile]);
                       });

                   });

                } //end of main else
                  $('#sp_list_tab').DataTable( {
                  "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
                  });
              } // end of sucsess
      }); // ajax call
}, 2600);

//---------------------------------------------------------------
// Ecoregion LEGEND
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

$("#showecomap1").click(function(event) {
  event.preventDefault();
  if ($("#ecolegend").length === 0){
    legendeco.addTo(lMap);
    $("#tecoon").show()
  }
  else {
    lMap.removeControl(legendeco);
    $("#tecoon").hide()
  }
});



$("#tecoon").click(function(event) {
  event.preventDefault();
  if ($("#ecolegend").length === 0){
    legendeco.addTo(lMap);
  }
  else {
    lMap.removeControl(legendeco);
  }
});

// //---------------------------------------------------------------
// //  Ecoregion LAYER - GET FEATUREINFO FUNCTION
// //---------------------------------------------------------------
//
   function getFeatureInfoUrl_e(map, layer, latlng, params) {

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
//
//
//  //---------------------------------------------------------------
//  // ONCLICK RESPONSE ON HIGLIGHTED ECOREGIONS
//  //--------------------------------------------------------------
        function hi_highcharts_eco(info,latlng){
          var eco_name=info['eco_name'];
          var id=info['id'];
          var biome=info['biome'];
          var realm=info['realm'];
          var connect=info['connect'];
          var protection=info['protection'];
          var popupContenteco = '<center><a href="/ecoregion/'+id+'">'+eco_name+'</a></center><hr>';
          var popup_eco = L.popup()
               .setLatLng([latlng.lat, latlng.lng])
               .setContent(popupContenteco)
               .openOn(lMap);
 }
//
//  //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//  //  Ecoregion HIGHLIGHT WMS SETUP
//  //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//
       var eco_ter_url = 'http://lrm-maps.jrc.ec.europa.eu/geoserver/lrm/wms';
       var eco_hi=L.tileLayer.wms(eco_ter_url, {
           layers: 'lrm:eco_mar_ter_prot_con_2016_hi',
           transparent: true,
           format: 'image/png',
           opacity:'1',
           zIndex: 34
        }).addTo(lMap);

        eco_hi.setParams({CQL_FILTER:"eco_name LIKE ''"});

//----------------------------------------------------------------------------------------------------------------------------------------------------
//  Ecoregion list in PA tab
//----------------------------------------------------------------------------------------------------------------------------------------------------
setTimeout(function(){
  var wdpaid_eco_list= $('.wdpa-id').text();
  var urleco_list = 'http://dopa-services.jrc.ec.europa.eu/services/h05ibex/ehabitat/get_ecoregion_in_wdpa?format=json&wdpaid=' + wdpaid_eco_list;

  $.ajax({
          url: urleco_list,
          dataType: 'json',
          success: function(d) {
              if (d.metadata.recordCount == 0) {
                jQuery('#eco_list_tab').html('<img src="/sites/default/files/sna2.png" alt="Mountain View">');
              } else {
                   var ecoregion_id = [];
                   var eco_name = [];
                   var is_marine = [];
                   var fields = {'ecoregion_id':"",'eco_name':"",'is_marine':""};

                  $(d.records).each(function(i, data) {

                      $('#eco_list_tab tbody').append('<tr id="'+i.toString()+'" class="eco_list_tr"></tr>');

                      for (var prop in fields){
                          if(prop == 'ecoregion_id'){
                              ecoregion_id.push(data[prop]);

                              $('#eco_list_tab tbody tr[id="'+i+'"]').append('<td>'+data[prop]+'</td>');
                          }
                          else if(prop == 'eco_name'){
                              eco_name.push(data[prop]);
                               $('#eco_list_tab tbody tr[id="'+i+'"]').append('<td>'+'<a href="/ecoregion/'+data['ecoregion_id']+'" target="_blank">'+data[prop]+'</a>'+'</td>');

// filters for marine and terrestrial ecoregion layer ------------------------------------------------------------
                              var eco_filter_ter="eco_name LIKE'"+data[prop]+"'";
                            //  var eco_filter_mar="ecoregion LIKE'"+data[prop]+"'";
// add terrestrial ecoregion layer --------------------------------------------------------------------------------
                              var eco_ter_url = 'http://lrm-maps.jrc.ec.europa.eu/geoserver/lrm/wms';
                              var eco_ter=L.tileLayer.wms(eco_ter_url, {
                                layers: 'lrm:eco_mar_ter_prot_con_2016',
                                transparent: true,
                                format: 'image/png',
                                featureInfoFormat: 'text/javascript',
                                makeLayerQueryable: true,
                                zIndex: 32
                              });
                              eco_ter.setParams({CQL_FILTER:eco_filter_ter});

// add layers to the map -------------------------------------------------------------------------------------------
                                var baseMaps = {
                                  'Landscape': streets,
                                  'Google satellite': satellite
                                 };
                               var overlayMaps = {
                                    'ecoregions':eco_ter,
                                  //  'ecoregions marine':eco_mar,
                                };

                                // ---------------------------------------------------------------
                                //  ecoregion ONCLICK FUNCTION
                                // ---------------------------------------------------------------
                                lMap.on('click', function(e) {
                                 if (lMap.hasLayer(eco_ter)) {
                                var eco_latlng= e.latlng;
                                var eco_ter_url = getFeatureInfoUrl_e(
                                                lMap,
                                                eco_ter,
                                                e.latlng,
                                                {
                                                  'info_format': 'text/javascript',  //it allows us to get a jsonp
                                                  'propertyName': 'id,eco_name,biome,realm,connect,protection',
                                                  'query_layers': 'lrm:eco_mar_ter_prot_con_2016',
                                                  'format_options':'callback:getJson'
                                                }
                                            );

                                             $.ajax({
                                                     jsonp: false,
                                                     url: eco_ter_url,
                                                     dataType: 'jsonp',
                                                     jsonpCallback: 'getJson',
                                                     success: handleJson_featureRequest_eco
                                                   });
                                                function handleJson_featureRequest_eco(data1)
                                                {
                                                   if (typeof data1.features[0]!=='undefined')
                                                       {
                                                          var prop1=data1.features[0].properties;
                                                          var filter1="id='"+prop1['id']+"'";
                                                          eco_hi.setParams({CQL_FILTER:filter1});
                                                          hi_highcharts_eco(prop1,eco_latlng);
                                                    }
                                                    else {
                                                      console.log(' no info')
                                                    }
                                                }
                                            }
                                  });

// Button - add ecoregion layer and scroll to the top --------------------------------------------------------
                               $("#showecomap1").click(function(event) {
                                 event.preventDefault();
                                 if (lMap.hasLayer(eco_ter)) { //only for terrestrial ecoregions
                                       $('html,body').animate({
                                           scrollTop: $('#breadcrumb').css('top')
                                       }, 100, function() {
                                           $('html, body').animate({
                                               scrollTop: 0
                                           }, 100);
                                       });
                                   lMap.removeLayer(eco_ter);
                                   lMap.removeLayer(eco_hi);
                                  $('#wdpamenulist').show();

                                 } else {
                                   lMap.addLayer(eco_ter);
                                $('#wdpamenulist').hide();
                                   lMap.addLayer(eco_hi);

                                   $('html,body').animate({
                                       scrollTop: $('#breadcrumb').css('top')
                                   }, 100, function() {
                                       $('html, body').animate({
                                           scrollTop: 0
                                       }, 100);
                                   });
                                 }
                               });
                               $("#tecoon").click(function(event) {
                                 event.preventDefault();
                                 if (lMap.hasLayer(eco_ter)) { //only for terrestrial ecoregions
                                       $('html,body').animate({
                                           scrollTop: $('#breadcrumb').css('top')
                                       }, 100, function() {
                                           $('html, body').animate({
                                               scrollTop: 0
                                           }, 100);
                                       });
                                   lMap.removeLayer(eco_ter);
                                   lMap.removeLayer(eco_hi);
                                   $('#wdpamenulist').show();
                                //   lMap.removeLayer(eco_mar);

                                 } else {
                                   lMap.addLayer(eco_ter);
                              $('#wdpamenulist').hide();
                                   lMap.addLayer(eco_hi);

                                   $('html,body').animate({
                                       scrollTop: $('#breadcrumb').css('top')
                                   }, 100, function() {
                                       $('html, body').animate({
                                           scrollTop: 0
                                       }, 100);
                                   });
                                 }
                               });

                          } // end of else if

                          else if(prop == 'is_marine'){
                              is_marine.push(data[prop]);
                              var color = data[prop];
                              if (color == true){
                              $('#eco_list_tab tbody tr[id="'+i+'"]').append('<td style="background-color: #c8e5f7;">Marine</td>');
                            }else{
                              $('#eco_list_tab tbody tr[id="'+i+'"]').append('<td style="background-color: #b6da83;">Terrestrial</td>');
                            }
                          }
                          else {

                            }
                      } // end of for

                  });
                }
                 //end of main else
               $('#eco_list_tab').DataTable( {
                  "bFilter": false,
                  "bPaginate": false,
                  "info": false
                  });
              } // end of sucsess

      }); // ajax call

}, 100);

// color marine terretrial first table
var table = document.getElementById('wdpa_general_info');
var tbody = table.getElementsByTagName('tbody')[0];
var cells = tbody.getElementsByClassName('views-field-field-wdpa-marine');

if (parseFloat ($('td.views-field-field-wdpa-marine').html()) == 0) {
  $(cells).html('<td style="background-color: #7ebe25; color: white; border-radius: 2px;">Terrestrial</td>');
}
else if (parseFloat ($('td.views-field-field-wdpa-marine').html()) == 2) {
  $(cells).html('<td style="background-color: #22a6f5; color: white; border-radius: 2px;">Marine</td>');
}
else{
  $(cells).html('<td style="background-color: #69ce9a; color: white; border-radius: 2px;">Terrestrial/Marine</td>');
}

// hide from print
//$( ".pane-25" ).addClass( "hidden-print1" );

$( "#header" ).addClass( "hidden-print1" );
$( "#breadcrumb" ).addClass( "hidden-print1" );
$( ".export_elevation" ).addClass( "hidden-print1" );
$( ".leaflet-bottom" ).addClass( "hidden-print1" );
$( ".ecobutt" ).addClass( "hidden-print1" );
$( "#cssmenu" ).addClass( "hidden-print1" );
$( ".export_lc2000_tab" ).addClass( "hidden-print1" );
$( ".export_lc2005_tab" ).addClass( "hidden-print1" );
$( ".showlc2000graph" ).addClass( "hidden-print1" );
$( ".showlc2005graph" ).addClass( "hidden-print1" );
$( ".btn-danger" ).addClass( "hidden-print1" );
$( ".export_species_tab" ).addClass( "hidden-print1" );
$( ".export_species_list_tab" ).addClass( "hidden-print1" );
$( ".tabs-style-iconbox" ).addClass( "hidden-print1" );
$( "#subfooter" ).addClass( "hidden-print1" );
$( "#toTop" ).addClass( "hidden-print1" );
$( ".leaflet-control-zoom" ).addClass( "hidden-print1" );
$( "#block-block-137" ).addClass( "hidden-print1" );
$( "#show_water_ch" ).addClass( "hidden-print1" );
$( "#show_water_tr" ).addClass( "hidden-print1" );
$( "#show_water_oc" ).addClass( "hidden-print1" );


//--------------------------------------------------------------------------------------------------------
// show water layers
//--------------------------------------------------------------------------------------------------------

    $("#show_water_oc").click(function(event) {
      event.preventDefault();
      if (lMap.hasLayer(occurrence)) { //only for terrestrial ecoregions
            $('html,body').animate({
                scrollTop: $('#breadcrumb').css('top')
            }, 100, function() {
                $('html, body').animate({
                    scrollTop: 0
                }, 100);
            });
        lMap.removeLayer(occurrence);
        $( "#water_eccurence_legend" ).hide();


      } else {
        lMap.addLayer(occurrence);
        lMap.removeLayer(transitions);
        lMap.removeLayer(change);
       $( "#water_eccurence_legend" ).show();
       $( "#water_change_legend" ).hide();
         $( "#water_transition_legend" ).hide();




        $('html,body').animate({
            scrollTop: $('#breadcrumb').css('top')
        }, 100, function() {
            $('html, body').animate({
                scrollTop: 0
            }, 100);
        });
      }
    });


    $("#show_water_tr").click(function(event) {
      event.preventDefault();
      if (lMap.hasLayer(transitions)) { //only for terrestrial ecoregions
            $('html,body').animate({
                scrollTop: $('#breadcrumb').css('top')
            }, 100, function() {
                $('html, body').animate({
                    scrollTop: 0
                }, 100);
            });
        lMap.removeLayer(transitions);
          $( "#water_transition_legend" ).hide();




      } else {
        lMap.addLayer(transitions);
        lMap.removeLayer(occurrence);
        lMap.removeLayer(change);
        $( "#water_transition_legend" ).show();
        $( "#water_change_legend" ).hide();
        $( "#water_eccurence_legend" ).hide();


        $('html,body').animate({
            scrollTop: $('#breadcrumb').css('top')
        }, 100, function() {
            $('html, body').animate({
                scrollTop: 0
            }, 100);
        });
      }
    });

    $("#show_water_ch").click(function(event) {
      event.preventDefault();
      if (lMap.hasLayer(change)) {
            $('html,body').animate({
                scrollTop: $('#breadcrumb').css('top')
            }, 100, function() {
                $('html, body').animate({
                    scrollTop: 0
                }, 100);
            });
        lMap.removeLayer(change);
        $( "#water_change_legend" ).hide();



      } else {
        lMap.addLayer(change);
        lMap.removeLayer(occurrence);
        lMap.removeLayer(transitions);
        $( "#water_change_legend" ).show();
        $( "#water_eccurence_legend" ).hide();
        $( "#water_transition_legend" ).hide();

        $('html,body').animate({
            scrollTop: $('#breadcrumb').css('top')
        }, 100, function() {
            $('html, body').animate({
                scrollTop: 0
            }, 100);
        });
      }
    });


// END OF MAIN FUNCTION
})
})(jQuery);
