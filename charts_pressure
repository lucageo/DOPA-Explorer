jQuery(document).ready(function($) {
    var $paid = $('.wdpa-id').text();
    var $paname = $('.field-name-field-protected-area-name > div.field-items > div').text();
	var $countrynum = $('span.pa-iso-num').text();
	var $countryname = $('span.views-field-field-country-name > span > a').text();
	var DOPA_REST_URL = 'http://dopa-services.jrc.ec.europa.eu/services/ibex/';
	var serviceNames = {
		'ppi':{
			endpoint: 'ehabitat/get_ppi_country?countryid='+$countrynum,
			indicatorvalue: 'ppi',
			normalisedField:'normalised_ppi',
			normalisedAvgField:'normalised_avg_ppi',
			title:'Population density pressure index <br>for '+$countryname,
			ytitle:'Population density pressure',
			color: '#BFCFE1',
			hilite: '#003F87'
		},
		'ppi_change':{
			endpoint: 'ehabitat/get_ppi_change_country?countryid='+$countrynum,
			indicatorvalue: 'percent_change',
			normalisedField:'normalised_ppi_change',
			normalisedAvgField:'normalised_avg_ppi_change',
			title:'Change in population density pressure <br>from ' + ' 1990-2000 in '+$countryname,
			ytitle:'Change in population density pressure',
			color: '#BFCFE1',
			hilite: '#003F87'
		},
		'ap':{
			endpoint: 'ehabitat/get_agri_pressure_gw_country?countryid='+$countrynum,
			indicatorvalue: 'ap',
			normalisedField:'normalised_ap',
			normalisedAvgField:'normalised_avg_ap',
			title:'Agricultural Pressure index <br>for '+$countryname,
			ytitle:'Agricultural pressure',
			color: '#BFCFE1',
			hilite: '#003F87'
		},
		'roads_pressure':{
			endpoint: 'ehabitat/get_roads_pressure_country?countryid='+$countrynum,
			indicatorvalue: 'roads',
			normalisedField:'normalised_roads',
			normalisedAvgField:'normalised_avg_roads',
			title:'External roads pressure index <br>for '+$countryname,
			ytitle:'External roads Pressure',
			color: '#BFCFE1',
			hilite: '#003F87'
		},
		'roads_in':{
			endpoint: 'ehabitat/get_internal_roads_pressure_country?countryid='+$countrynum,
			indicatorvalue: 'roads_in',
			normalisedField:'normalised_roads_in',
			normalisedAvgField:'normalised_avg_roads_in',
			title:'Internal roads pressure index <br>for '+$countryname,
			ytitle:'Internal roads pressure',
			color: '#BFCFE1',
			hilite: '#003F87'
		}
	};

	function create_chart(param)
	{
		var url=DOPA_REST_URL+serviceNames[param].endpoint;
		$.ajax({
			url: url,
			dataType: 'json',
			success: function(d) {
				if (d.metadata.recordCount == 0) {
					jQuery('#country-pressure-chart.rest-good.'+param).switchClass( "rest-good", "alert alert-info", 100 );
					jQuery('#country-pressure-chart.'+param).append('There is no '+serviceNames[param].title+' data for ' + $paname)
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
								country_rank.push(data[prop]);
							}
							else {
							}
						}
					});


					$('#country-pressure-chart.'+param).highcharts({
						chart: {
							type: 'column',
							height: 300,
							width: 500
						},

						title: {
							text: serviceNames[param].title,
							floating: true,
							align: 'left',
							x:90,
							y:20
						},
						subtitle: {
							//text: 'Source: DOPA'
						},
						pane: {
							size: '100%'
						},
						credits: {
							enabled: true,
							text: 'Source: DOPA',
							href: 'http://ehabitat-wps.jrc.ec.europa.eu/dopa_explorer/?pa='+$paid
						},
						xAxis: {
							title: {
								text: 'Country Rank',
								color: '#3E576F',
								style: {
									color: '#3E576F'
								}
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
										s.push('Country Rank: ' + country_rank[series_id]+ '<br><span style="font-weight:bold;">WDPA ID: '+ wdpa_id[series_id] + '<br>' + point.series.name +': '+
										point.y +'<span><br><span style="text-align:center;"><a href="/pa/'+wdpa_id[series_id]+'">Click here to see this PA</a></span>');
								});
								return s.join('');
							},
							shared: true
						},
						yAxis: {
							title: {
								text: serviceNames[param].ytitle,
								color: '#3E576F',
								style: {
									color: '#3E576F'
								}
							},
							min: 0,
							max: 100,
							plotLines: [{
							color: '#0D6DDF',
							width: 2,
							value: normalised_avg,
							zIndex:5,
							label: {
								text: 'Average',
								align: 'right',
								x: -10
							}
							}]
						},
						plotOptions: {
							areaspline: {
								color: 'rgb(200,200,200)',
								//fillOpacity: 1,
								fillColor: {
									linearGradient: [0, 0, 0, 500],
									stops: [
										[0, '#DED6A3'],
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
				jQuery('#country-pressure-chart.rest-good.'+param).switchClass( "rest-good", "alert alert-warning", 100 );
				jQuery('#country-pressure-chart.'+param).append('The climate services are unavailable at the moment.')
			}
		});
	}
	create_chart('ppi');
	create_chart('ppi_change');
	create_chart('roads_pressure');
	create_chart('roads_in');
	create_chart('ap');
});
