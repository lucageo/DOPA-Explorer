//------------------------------Combine two filters for ecoregions-----------------------------------------
/*
$=jQuery;
function change_te(name)
  {
$("#edit-ecochart").val(name);
$('#edit-ecochart-wrapper').parent().find('#edit-submit-graph-dopa-ecoregions-teow').eq(0).click()
  }
$("#edit-blabla").live('keyup', function(){
var name = $(this).val();
change_te(name)
})



$=jQuery;
function change_me(name)
  {
$("#edit-text-1").val(name);
$('#edit-text-1-wrapper').parent().find('#edit-submit-graph-dopa-ecoregions-teow').eq(0).click()
  }
$("#edit-text-3").live('keyup', function(){
var name = $(this).val();
change_me(name)
})
*/

//------------------------------HIDE AND DISPLAY MARINE ECOREGION CLASSIFICATION BUTTON---------------------------------------





//------------------------------Classify by terrestrial ecoregion protection world (%)-----------------------------------------

function classecoperprotworld(){
var table = document.getElementById('ecotertab');
var tbody = table.getElementsByTagName('tbody')[0];
var cells = tbody.getElementsByClassName('views-field-text-5');
var row =   table.getElementsByClassName ('eco-range');
var thead = table.getElementsByTagName('thead')[0];
var headcell = thead.getElementsByClassName('views-field-text-5');
var headcell2 = thead.getElementsByClassName('views-field-text-4');

for(var i = 0; i < headcell2.length; i++) {
         headcell2[i].style.backgroundColor = '#ffffff';
         headcell2[i].style.border = '0px solid #ffffff'; 
      }


for(var i = 0; i < headcell.length; i++) {
         headcell[i].style.backgroundColor = 'rgb(247, 247, 247)';
         headcell[i].style.borderTop = '2px solid gray'; 
      }

for (var i=0, len=cells.length; i<len; i++){
    if (parseFloat(cells[i].innerHTML,10) <=1){
        row[i].style.backgroundColor = 'rgb(245, 172, 172)';
        row[i].style.borderBottom = '2px solid #FFFFFF';   
        row[i].style.borderLeft = '1px solid #FCE7E7'; 
        row[i].style.borderRight = '1px solid #FCE7E7'; 
            
    }
    else if (parseFloat(cells[i].innerHTML,10) <= 5){
        row[i].style.backgroundColor = 'rgb(252, 225, 175)'; 
        row[i].style.borderBottom = '2px solid #FFFFFF'; 
        row[i].style.borderLeft = '1px solid #fff6e7'; 
        row[i].style.borderRight = '1px solid #fff6e7';    
    }
    else if (parseFloat(cells[i].innerHTML,10) <= 10){
        row[i].style.backgroundColor = 'rgb(251, 245, 153)';
        row[i].style.borderBottom = '2px solid #FFFFFF';      
        row[i].style.borderLeft = '1px solid #FEFDEE'; 
        row[i].style.borderRight = '1px solid #FEFDEE';
    }
    else if (parseFloat(cells[i].innerHTML,10) <= 17){
        row[i].style.backgroundColor = 'rgb(202, 221, 160)';
        row[i].style.borderBottom = '2px solid #FFFFFF';    
        row[i].style.borderLeft = '1px solid #f0f5e3'; 
        row[i].style.borderRight = '1px solid #f0f5e3';  
    }
    else{
        row[i].style.backgroundColor = 'rgb(155, 183, 162)';    
        row[i].style.borderBottom = '2px solid #FFFFFF';    
        row[i].style.borderLeft = '1px solid #e1eae4'; 
        row[i].style.borderRight = '1px solid #e1eae4';
    }
  }
}
//--------------------------------------------------------------wdpa class-----------------------------------------------------------------------
/*
(function ($) {
     
    Drupal.behaviors.clearprotecowaaa = {
        attach: function(context, settings) {

var table = document.getElementById('ecotertab wdpacolors');
var tbody = table.getElementsByTagName('tbody')[0];
var cells = tbody.getElementsByClassName('views-field-text-6');
var cells2 = tbody.getElementsByClassName('views-field-text-1');
var row =   table.getElementsByClassName ('rangewdpa');
var thead = table.getElementsByTagName('thead')[0];

for (var i=0, len=cells.length; i<len; i++){
    if (cells[i].innerText ==="Not Assigned"){
        cells[i].style.backgroundColor = 'rgba(255, 0, 0, 0.2)';  
		cells2[i].style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
    }
    else if (cells[i].innerText ==="Not Reported"){
        cells[i].style.backgroundColor = 'rgba(255, 85, 0, 0.2)';    
		cells2[i].style.backgroundColor = 'rgba(255, 85, 0, 0.2)';    
    }
    else if (cells[i].innerText ==="VI"){
        cells[i].style.backgroundColor = 'rgba(255, 170, 0, 0.2)';
		cells2[i].style.backgroundColor = 'rgba(255, 170, 0, 0.2)';
    }
    else if (cells[i].innerText ==="V"){
        cells[i].style.backgroundColor = 'rgba(255, 255, 0, 0.2)';  
		cells2[i].style.backgroundColor = 'rgba(255, 255, 0, 0.2)'; 
    }
    else if (cells[i].innerText ==="IV"){
        cells[i].style.backgroundColor = 'rgba(161, 202, 79, 0.2)';  
		cells2[i].style.backgroundColor = 'rgba(161, 202, 79, 0.2)'; 
    }
    else if (cells[i].innerText ==="III"){
        cells[i].style.backgroundColor = 'rgba(85, 255, 0, 0.2)';  
		cells2[i].style.backgroundColor = 'rgba(85, 255, 0, 0.2)';  
    }
    else if (cells[i].innerText ==="II"){
        cells[i].style.backgroundColor = 'rgba(0, 255, 0, 0.2)';  
		cells2[i].style.backgroundColor = 'rgba(0, 255, 0, 0.2)'; 
    }
    else if (cells[i].innerText ==="I"){
        cells[i].style.backgroundColor = 'rgba(0, 255, 255, 0.2)';  
		cells2[i].style.backgroundColor = 'rgba(0, 255, 255, 0.2)'; 
    }
	else if (cells[i].innerText ==="Ib"){
		cells[i].style.backgroundColor = 'rgba(0, 170, 255, 0.2)'; 
		cells2[i].style.backgroundColor = 'rgba(0, 170, 255, 0.2)';  	
    }
	else if (cells[i].innerText ==="Ia"){
		cells[i].style.backgroundColor = 'rgba(0, 85, 255, 0.2)';  
		cells2[i].style.backgroundColor = 'rgba(0, 85, 255, 0.2)';  
    }
    else{
 
    }
  }

        }
    };
})(jQuery);
*/
//--------------------------------------------------------------------------------------------------------------------------------

(function ($) {
     
    Drupal.behaviors.clearprotecow21 = {
        attach: function(context, settings) {
var table = document.getElementById('ecotertab wdpacolors');
var tbody = table.getElementsByTagName('tbody')[0];
var cells = tbody.getElementsByClassName('views-field-expression');
var row =   table.getElementsByClassName ('rangewdpa');
var thead = table.getElementsByTagName('thead')[0];

var arr =[];
for (var i=0, len=cells.length; i<len; i++){
	arr.push(parseFloat(cells[i].innerHTML));
};

for (var i=0, len=cells.length; i<len; i++){
    if (parseFloat(cells[i].innerHTML) === Math.min.apply(Math,arr)){
        cells[i].style.backgroundColor = 'rgba(161, 202, 79, 0.16)'; 
        row[i].style.backgroundColor = "rgba(161, 202, 79, 0.12)";		
    };
};
        }
    };
})(jQuery);
//-------------------------------------------------------------------------------------------------------------------

(function ($) {
     
    Drupal.behaviors.clearprotecow11 = {
        attach: function(context, settings) {

var table = document.getElementById('ecotertab wdpacolors');
var tbody = table.getElementsByTagName('tbody')[0];
var cells = tbody.getElementsByClassName('views-field-expression');
var row =   table.getElementsByClassName ('rangewdpa');
var thead = table.getElementsByTagName('thead')[0];

var arr =[];
for (var i=0, len=cells.length; i<len; i++){
	arr.push(parseFloat(cells[i].innerHTML));
};

for (var i=0, len=cells.length; i<len; i++){
    if (parseFloat(cells[i].innerHTML) === Math.max.apply(Math,arr)){
        cells[i].style.backgroundColor = 'rgba(255, 0, 0, 0.06)'; 
        row[i].style.backgroundColor = "rgba(255, 0, 0, 0.06)";		
    };
};

        }
    };
})(jQuery);

//-----------------------------------------------


(function ($) {
     
    Drupal.behaviors.clearprotecow = {
        attach: function(context, settings) {

     $('#classecoprotw').live('click',function()

{
$('#ecotertableg').show(90); 
classecoperprotworld();
return false;
})

        }
    };
})(jQuery);


//------------------------------Classify by terrestrial ecoregion protection in country (%)-----------------------------------------

function classecoperprotcountry(){
var table = document.getElementById('ecotertab');
var tbody = table.getElementsByTagName('tbody')[0];
var cells = tbody.getElementsByClassName('views-field-text-4');
var row =   table.getElementsByClassName ('eco-range');
var thead = table.getElementsByTagName('thead')[0];
var headcell = thead.getElementsByClassName('views-field-text-4');
var headcell2 = thead.getElementsByClassName('views-field-text-5');

for(var i = 0; i < headcell2.length; i++) {
         headcell2[i].style.backgroundColor = '#ffffff';
         headcell2[i].style.border = '0px solid #ffffff'; 
      }


for(var i = 0; i < headcell.length; i++) {
         headcell[i].style.backgroundColor = 'rgb(247, 247, 247)';
         headcell[i].style.borderTop = '2px solid gray'; 
      }

for (var i=0, len=cells.length; i<len; i++){
    if (parseFloat(cells[i].innerHTML,10) <=1){
        row[i].style.backgroundColor = 'rgb(245, 172, 172)';
        row[i].style.borderBottom = '2px solid #FFFFFF';   
        row[i].style.borderLeft = '1px solid #FCE7E7'; 
        row[i].style.borderRight = '1px solid #FCE7E7'; 
            
    }
    else if (parseFloat(cells[i].innerHTML,10) <= 5){
        row[i].style.backgroundColor = 'rgb(252, 225, 175)'; 
        row[i].style.borderBottom = '2px solid #FFFFFF'; 
        row[i].style.borderLeft = '1px solid #fff6e7'; 
        row[i].style.borderRight = '1px solid #fff6e7';    
    }
    else if (parseFloat(cells[i].innerHTML,10) <= 10){
        row[i].style.backgroundColor = 'rgb(251, 245, 153)';
        row[i].style.borderBottom = '2px solid #FFFFFF';      
        row[i].style.borderLeft = '1px solid #FEFDEE'; 
        row[i].style.borderRight = '1px solid #FEFDEE';
    }
    else if (parseFloat(cells[i].innerHTML,10) <= 17){
        row[i].style.backgroundColor = 'rgb(202, 221, 160)';
        row[i].style.borderBottom = '2px solid #FFFFFF';    
        row[i].style.borderLeft = '1px solid #f0f5e3'; 
        row[i].style.borderRight = '1px solid #f0f5e3';  
    }
    else{
        row[i].style.backgroundColor = 'rgb(155, 183, 162)';    
        row[i].style.borderBottom = '2px solid #FFFFFF';    
        row[i].style.borderLeft = '1px solid #e1eae4'; 
        row[i].style.borderRight = '1px solid #e1eae4';
    }
  }
}

(function ($) {

     $('#classecoprot').live('click',function()

{
$('#ecotertableg').show(90); 
classecoperprotcountry();
return false;
})

//--------------------------------------Clear classification terrestrial ecoregions------------------------------------------------------


function closecolor(){
var table = document.getElementById('ecotertab');
var tbody = table.getElementsByTagName('tbody')[0];
var cells = tbody.getElementsByClassName('views-field-text-4');
var row =   table.getElementsByClassName ('eco-range');
var thead = table.getElementsByTagName('thead')[0];
var headcell = thead.getElementsByClassName('views-field-text-4');
var headcell2 = thead.getElementsByClassName('views-field-text-5');

for(var i = 0; i < headcell2.length; i++) {
         headcell2[i].style.backgroundColor = '#ffffff';
         headcell2[i].style.border = '0px solid #ffffff'; 
      }

for(var i = 0; i < headcell.length; i++) {
         headcell[i].style.backgroundColor = '#ffffff';
         headcell[i].style.border = '0px solid #ffffff'; 
      }

for (var i=0, len=cells.length; i<len; i++){
        row[i].style.backgroundColor = '#ffffff';
        row[i].style.borderBottom = '1px solid #DFDFDF'; 
        row[i].style.borderLeft = '1px solid #DFDFDF'; 
        row[i].style.borderRight = '1px solid #DFDFDF'; 
    }
}

(function ($) {
     
    Drupal.behaviors.clearproteco = {
        attach: function(context, settings) {

     $('#clearclass').live('click',function()
{
$('#ecotertableg').hide(90);
closecolor();
return false;
})

        }
    };
})(jQuery);


//------------------------------Classify by Marine ecoregion protection world (%)-----------------------------------------

function classecoperprotworldmar(){
var table = document.getElementById('ecomartab');
var tbody = table.getElementsByTagName('tbody')[0];
var cells = tbody.getElementsByClassName('views-field-text-5');
var row =   table.getElementsByClassName ('eco-range');
var thead = table.getElementsByTagName('thead')[0];
var headcell = thead.getElementsByClassName('views-field-text-5');
var headcell2 = thead.getElementsByClassName('views-field-text-4');

for(var i = 0; i < headcell2.length; i++) {
         headcell2[i].style.backgroundColor = '#ffffff';
         headcell2[i].style.border = '0px solid #ffffff'; 
      }


for(var i = 0; i < headcell.length; i++) {
         headcell[i].style.backgroundColor = 'rgb(247, 247, 247)';
         headcell[i].style.borderTop = '2px solid gray'; 
      }

for (var i=0, len=cells.length; i<len; i++){
    if (parseFloat(cells[i].innerHTML,10) <=1){
        row[i].style.backgroundColor = 'rgb(245, 172, 172)';
        row[i].style.borderBottom = '2px solid #FFFFFF';   
        row[i].style.borderLeft = '1px solid #FCE7E7'; 
        row[i].style.borderRight = '1px solid #FCE7E7'; 
            
    }
    else if (parseFloat(cells[i].innerHTML,10) <= 5){
        row[i].style.backgroundColor = 'rgb(252, 225, 175)'; 
        row[i].style.borderBottom = '2px solid #FFFFFF'; 
        row[i].style.borderLeft = '1px solid #fff6e7'; 
        row[i].style.borderRight = '1px solid #fff6e7';    
    }
    else if (parseFloat(cells[i].innerHTML,10) <= 10){
        row[i].style.backgroundColor = 'rgb(251, 245, 153)';
        row[i].style.borderBottom = '2px solid #FFFFFF';      
        row[i].style.borderLeft = '1px solid #FEFDEE'; 
        row[i].style.borderRight = '1px solid #FEFDEE';
    }
    else if (parseFloat(cells[i].innerHTML,10) <= 17){
        row[i].style.backgroundColor = 'rgb(202, 221, 160)';
        row[i].style.borderBottom = '2px solid #FFFFFF';    
        row[i].style.borderLeft = '1px solid #f0f5e3'; 
        row[i].style.borderRight = '1px solid #f0f5e3';  
    }
    else{
        row[i].style.backgroundColor = 'rgb(155, 183, 162)';    
        row[i].style.borderBottom = '2px solid #FFFFFF';    
        row[i].style.borderLeft = '1px solid #e1eae4'; 
        row[i].style.borderRight = '1px solid #e1eae4';
    }
  }
}

(function ($) {
     
    Drupal.behaviors.clearprotecowmar = {
        attach: function(context, settings) {

     $('#classecoprotwmar').live('click',function()

{
$('#ecotertablegmar').show(90); 
classecoperprotworldmar();
return false;
})

        }
    };
})(jQuery);


//------------------------------Classify by MARINE ecoregion protection in country (%)-----------------------------------------

function classecoperprotcountrymar(){
var table = document.getElementById('ecomartab');
var tbody = table.getElementsByTagName('tbody')[0];
var cells = tbody.getElementsByClassName('views-field-text-4');
var row =   table.getElementsByClassName ('eco-range');
var thead = table.getElementsByTagName('thead')[0];
var headcell = thead.getElementsByClassName('views-field-text-4');
var headcell2 = thead.getElementsByClassName('views-field-text-5');

for(var i = 0; i < headcell2.length; i++) {
         headcell2[i].style.backgroundColor = '#ffffff';
         headcell2[i].style.border = '0px solid #ffffff'; 
      }


for(var i = 0; i < headcell.length; i++) {
         headcell[i].style.backgroundColor = 'rgb(247, 247, 247)';
         headcell[i].style.borderTop = '2px solid gray'; 
      }

for (var i=0, len=cells.length; i<len; i++){
    if (parseFloat(cells[i].innerHTML,10) <=1){
        row[i].style.backgroundColor = 'rgb(245, 172, 172)';
        row[i].style.borderBottom = '2px solid #FFFFFF';   
        row[i].style.borderLeft = '1px solid #FCE7E7'; 
        row[i].style.borderRight = '1px solid #FCE7E7'; 
            
    }
    else if (parseFloat(cells[i].innerHTML,10) <= 5){
        row[i].style.backgroundColor = 'rgb(252, 225, 175)'; 
        row[i].style.borderBottom = '2px solid #FFFFFF'; 
        row[i].style.borderLeft = '1px solid #fff6e7'; 
        row[i].style.borderRight = '1px solid #fff6e7';    
    }
    else if (parseFloat(cells[i].innerHTML,10) <= 10){
        row[i].style.backgroundColor = 'rgb(251, 245, 153)';
        row[i].style.borderBottom = '2px solid #FFFFFF';      
        row[i].style.borderLeft = '1px solid #FEFDEE'; 
        row[i].style.borderRight = '1px solid #FEFDEE';
    }
    else if (parseFloat(cells[i].innerHTML,10) <= 17){
        row[i].style.backgroundColor = 'rgb(202, 221, 160)';
        row[i].style.borderBottom = '2px solid #FFFFFF';    
        row[i].style.borderLeft = '1px solid #f0f5e3'; 
        row[i].style.borderRight = '1px solid #f0f5e3';  
    }
    else{
        row[i].style.backgroundColor = 'rgb(155, 183, 162)';    
        row[i].style.borderBottom = '2px solid #FFFFFF';    
        row[i].style.borderLeft = '1px solid #e1eae4'; 
        row[i].style.borderRight = '1px solid #e1eae4';
    }
  }
}

(function ($) {
     
    Drupal.behaviors.classecomarcountry = {
        attach: function(context, settings) {

     $('#classecoprotmar').live('click',function()

{
$('#ecotertablegmar').show(90); 
classecoperprotcountrymar();
return false;
})
        }
    };
})(jQuery);

//--------------------------------------Clear classification MARINE ecoregions------------------------------------------------------


function closecolormar(){
var table = document.getElementById('ecomartab');
var tbody = table.getElementsByTagName('tbody')[0];
var cells = tbody.getElementsByClassName('views-field-text-4');
var row =   table.getElementsByClassName ('eco-range');
var thead = table.getElementsByTagName('thead')[0];
var headcell = thead.getElementsByClassName('views-field-text-4');
var headcell2 = thead.getElementsByClassName('views-field-text-5');

for(var i = 0; i < headcell2.length; i++) {
         headcell2[i].style.backgroundColor = '#ffffff';
         headcell2[i].style.border = '0px solid #ffffff'; 
      }

for(var i = 0; i < headcell.length; i++) {
         headcell[i].style.backgroundColor = '#ffffff';
         headcell[i].style.border = '0px solid #ffffff'; 
      }

for(var i=0, len=cells.length; i<len; i++){

        row[i].style.backgroundColor = '#ffffff';
        row[i].style.borderBottom = '1px solid #DFDFDF'; 
        row[i].style.borderLeft = '1px solid #DFDFDF'; 
        row[i].style.borderRight = '1px solid #DFDFDF'; 
    }
}

(function ($) {
     
    Drupal.behaviors.clearprotecomar = {
        attach: function(context, settings) {

     $('#clearclassmar').live('click',function()
{
$('#ecotertablegmar').hide(90);
closecolormar();
return false;
})


        }
    };
})(jQuery);



//--------------------switch on and of items on the page-----------------------------------------

    Drupal.behaviors.closeopenbutton = {
        attach: function(context, settings) {
            
            //attach click event to buttons
            $('.show-chart-al').click(function(){

                $('#highcharts-4').show(2000); 
                $( ".show-chart-al" ).addClass( "button-hide-al" );
                $( ".show-chart-al" ).removeClass( "button-show-al" );
                $( ".hide-chart-al" ).removeClass( "button-hide-al" );
                $( ".hide-chart-al" ).addClass( "button-show-al" );

            });

            $('.hide-chart-al').click(function(){

                $('#highcharts-4').hide(1000); 
                $( ".hide-chart-al" ).removeClass( "button-show-al" );
                $( ".hide-chart-al" ).addClass( "button-hide-al" );
                $( ".show-chart-al" ).removeClass( "button-hide-al" );
                $( ".show-chart-al" ).addClass( "button-show-al" );



            });
        }
    };

})(jQuery);

(function ($) {
    
    Drupal.behaviors.closeopenbutton1 = {
        attach: function(context, settings) {
            
            //attach click event to buttons
            $('.show-chart-alp').click(function(){

                $('#highcharts-8').show(2000); 
                $( ".show-chart-alp" ).addClass( "button-hide-alp" );
                $( ".show-chart-alp" ).removeClass( "button-show-alp" );
                $( ".hide-chart-alp" ).removeClass( "button-hide-alp" );
                $( ".hide-chart-alp" ).addClass( "button-show-alp" );

            });

            $('.hide-chart-alp').click(function(){

                $('#highcharts-8').hide(1000); 
                $( ".hide-chart-alp" ).removeClass( "button-show-alp" );
                $( ".hide-chart-alp" ).addClass( "button-hide-alp" );
                $( ".show-chart-alp" ).removeClass( "button-hide-alp" );
                $( ".show-chart-alp" ).addClass( "button-show-alp" );



            });
        }
    };
})(jQuery);

(function ($) {
     
    Drupal.behaviors.closeopenbutton2 = {
        attach: function(context, settings) {
            
            //attach click event to buttons
            $('.show-chart-an').click(function(){

                $('#highcharts-12').show(2000); 
                $( ".show-chart-an" ).addClass( "button-hide-an" );
                $( ".show-chart-an" ).removeClass( "button-show-an" );
                $( ".hide-chart-an" ).removeClass( "button-hide-an" );
                $( ".hide-chart-an" ).addClass( "button-show-an" );

            });

            $('.hide-chart-an').click(function(){

                $('#highcharts-12').hide(1000); 
                $( ".hide-chart-an" ).removeClass( "button-show-an" );
                $( ".hide-chart-an" ).addClass( "button-hide-an" );
                $( ".show-chart-an" ).removeClass( "button-hide-an" );
                $( ".show-chart-an" ).addClass( "button-show-an" );



            });
        }
    };
})(jQuery);


(function ($) {
     
    Drupal.behaviors.closeopenbutton3 = {
        attach: function(context, settings) {
            
            //attach click event to buttons
            $('.show-chart-anp').click(function(){

                $('#highcharts-16').show(2000); 
                $( ".show-chart-anp" ).addClass( "button-hide-anp" );
                $( ".show-chart-anp" ).removeClass( "button-show-anp" );
                $( ".hide-chart-anp" ).removeClass( "button-hide-anp" );
                $( ".hide-chart-anp" ).addClass( "button-show-anp" );

            });

            $('.hide-chart-anp').click(function(){

                $('#highcharts-16').hide(1000); 
                $( ".hide-chart-anp" ).removeClass( "button-show-anp" );
                $( ".hide-chart-anp" ).addClass( "button-hide-anp" );
                $( ".show-chart-anp" ).removeClass( "button-hide-anp" );
                $( ".show-chart-anp" ).addClass( "button-show-anp" );



            });
        }
    };
})(jQuery);

(function ($) {
     
    Drupal.behaviors.closeopenbutton4 = {
        attach: function(context, settings) {
            
            //attach click event to buttons
            $('.show-chart-fa').click(function(){

                $('#highcharts-20').show(2000); 
                $( ".show-chart-fa" ).addClass( "button-hide-fa" );
                $( ".show-chart-fa" ).removeClass( "button-show-fa" );
                $( ".hide-chart-fa" ).removeClass( "button-hide-fa" );
                $( ".hide-chart-fa" ).addClass( "button-show-fa" );

            });

            $('.hide-chart-fa').click(function(){

                $('#highcharts-20').hide(1000); 
                $( ".hide-chart-fa" ).removeClass( "button-show-fa" );
                $( ".hide-chart-fa" ).addClass( "button-hide-fa" );
                $( ".show-chart-fa" ).removeClass( "button-hide-fa" );
                $( ".show-chart-fa" ).addClass( "button-show-fa" );



            });
        }
    };
})(jQuery);

(function ($) {
     
    Drupal.behaviors.closeopenbutton5 = {
        attach: function(context, settings) {
            
            //attach click event to buttons
            $('.show-chart-fap').click(function(){

                $('#highcharts-24').show(2000); 
                $( ".show-chart-fap" ).addClass( "button-hide-fap" );
                $( ".show-chart-fap" ).removeClass( "button-show-fap" );
                $( ".hide-chart-fap" ).removeClass( "button-hide-fap" );
                $( ".hide-chart-fap" ).addClass( "button-show-fap" );

            });

            $('.hide-chart-fap').click(function(){

                $('#highcharts-24').hide(1000); 
                $( ".hide-chart-fap" ).removeClass( "button-show-fap" );
                $( ".hide-chart-fap" ).addClass( "button-hide-fap" );
                $( ".show-chart-fap" ).removeClass( "button-hide-fap" );
                $( ".show-chart-fap" ).addClass( "button-show-fap" );



            });
        }
    };
})(jQuery);

(function ($) {
     
    Drupal.behaviors.closeopenbutton6 = {
        attach: function(context, settings) {
            
            //attach click event to buttons
            $('.show-chart-rp').click(function(){

                $('#highcharts-28').show(2000); 
                $( ".show-chart-rp" ).addClass( "button-hide-rp" );
                $( ".show-chart-rp" ).removeClass( "button-show-rp" );
                $( ".hide-chart-rp" ).removeClass( "button-hide-rp" );
                $( ".hide-chart-rp" ).addClass( "button-show-rp" );

            });

            $('.hide-chart-rp').click(function(){

                $('#highcharts-28').hide(1000); 
                $( ".hide-chart-rp" ).removeClass( "button-show-rp" );
                $( ".hide-chart-rp" ).addClass( "button-hide-rp" );
                $( ".show-chart-rp" ).removeClass( "button-hide-rp" );
                $( ".show-chart-rp" ).addClass( "button-show-rp" );



            });
        }
    };
})(jQuery);


(function ($) {
     
    Drupal.behaviors.closeopenbutton7 = {
        attach: function(context, settings) {
            
            //attach click event to buttons
            $('.show-chart-up').click(function(){

                $('#highcharts-32').show(2000); 
                $( ".show-chart-up" ).addClass( "button-hide-up" );
                $( ".show-chart-up" ).removeClass( "button-show-up" );
                $( ".hide-chart-up" ).removeClass( "button-hide-up" );
                $( ".hide-chart-up" ).addClass( "button-show-up" );

            });

            $('.hide-chart-up').click(function(){

                $('#highcharts-32').hide(1000); 
                $( ".hide-chart-up" ).removeClass( "button-show-up" );
                $( ".hide-chart-up" ).addClass( "button-hide-up" );
                $( ".show-chart-up" ).removeClass( "button-hide-up" );
                $( ".show-chart-up" ).addClass( "button-show-up" );



            });
        }
    };
})(jQuery);



(function ($) {
     
    Drupal.behaviors.closeopenbutton8 = {
        attach: function(context, settings) {
            
            //attach click event to buttons
            $('.show-chart-tp').click(function(){

                $('#highcharts-36').show(2000); 
                $( ".show-chart-tp" ).addClass( "button-hide-tp" );
                $( ".show-chart-tp" ).removeClass( "button-show-tp" );
                $( ".hide-chart-tp" ).removeClass( "button-hide-tp" );
                $( ".hide-chart-tp" ).addClass( "button-show-tp" );

            });

            $('.hide-chart-tp').click(function(){

                $('#highcharts-36').hide(1000); 
                $( ".hide-chart-tp" ).removeClass( "button-show-tp" );
                $( ".hide-chart-tp" ).addClass( "button-hide-tp" );
                $( ".show-chart-tp" ).removeClass( "button-hide-tp" );
                $( ".show-chart-tp" ).addClass( "button-show-tp" );



            });
        }
    };
})(jQuery);

(function ($) {
     
    Drupal.behaviors.closeopenbutton9 = {
        attach: function(context, settings) {
            
            //attach click event to buttons
            $('.show-chart-wb').click(function(){

                $('#wblinks').show(500); 
                $( ".show-chart-wb" ).addClass( "button-hide-wb" );
                $( ".show-chart-wb" ).removeClass( "button-show-wb" );
                $( ".hide-chart-wb" ).removeClass( "button-hide-wb" );
                $( ".hide-chart-wb" ).addClass( "button-show-wb" );

            });

            $('.hide-chart-wb').click(function(){

                $('#wblinks').hide(1000); 
                $( ".hide-chart-wb" ).removeClass( "button-show-wb" );
                $( ".hide-chart-wb" ).addClass( "button-hide-wb" );
                $( ".show-chart-wb" ).removeClass( "button-hide-wb" );
                $( ".show-chart-wb" ).addClass( "button-show-wb" );



            });
        }
    };
})(jQuery);

(function ($) {
     
    Drupal.behaviors.closeopenbutton10 = {
        attach: function(context, settings) {
            
            //attach click event to buttons
            $('.show-chart-te').click(function(){

                $('#ecotertab, #ecotertabg').show(500); 
                $( ".show-chart-te" ).addClass( "button-hide-te" );
                $( ".show-chart-te" ).removeClass( "button-show-te" );
                $( ".hide-chart-te" ).removeClass( "button-hide-te" );
                $( ".hide-chart-te" ).addClass( "button-show-te" );

            });

            $('.hide-chart-te').click(function(){

                $('#ecotertab, #ecotertabg').hide(1000); 
                $( ".hide-chart-te" ).removeClass( "button-show-te" );
                $( ".hide-chart-te" ).addClass( "button-hide-te" );
                $( ".show-chart-te" ).removeClass( "button-hide-te" );
                $( ".show-chart-te" ).addClass( "button-show-te" );



            });
        }
    };
})(jQuery);

(function ($) {
     
    Drupal.behaviors.closeopenbutton11 = {
        attach: function(context, settings) {
            
            //attach click event to buttons
            $('.show-chart-me').click(function(){

                $('#ecomartab, #ecomartabg').show(500); 
                $( ".show-chart-me" ).addClass( "button-hide-me" );
                $( ".show-chart-me" ).removeClass( "button-show-me" );
                $( ".hide-chart-me" ).removeClass( "button-hide-me" );
                $( ".hide-chart-me" ).addClass( "button-show-me" );

            });

            $('.hide-chart-me').click(function(){

                $('#ecomartab, #ecomartabg').hide(1000); 
                $( ".hide-chart-me" ).removeClass( "button-show-me" );
                $( ".hide-chart-me" ).addClass( "button-hide-me" );
                $( ".show-chart-me" ).removeClass( "button-hide-me" );
                $( ".show-chart-me" ).addClass( "button-show-me" );



            });
        }
    };
})(jQuery);

(function ($) {
     
    Drupal.behaviors.closeopenbutton12 = {
        attach: function(context, settings) {
            
            //attach click event to buttons
            $('.show-chart-spte').click(function(){

                $('#sptertab').show(500); 
                $( ".show-chart-spte" ).addClass( "button-hide-spte" );
                $( ".show-chart-spte" ).removeClass( "button-show-spte" );
                $( ".hide-chart-spte" ).removeClass( "button-hide-spte" );
                $( ".hide-chart-spte" ).addClass( "button-show-spte" );

            });

            $('.hide-chart-spte').click(function(){

                $('#sptertab').hide(1000); 
                $( ".hide-chart-spte" ).removeClass( "button-show-spte" );
                $( ".hide-chart-spte" ).addClass( "button-hide-spte" );
                $( ".show-chart-spte" ).removeClass( "button-hide-spte" );
                $( ".show-chart-spte" ).addClass( "button-show-spte" );



            });
        }
    };
})(jQuery);


(function ($) {
     
    Drupal.behaviors.closeopenbutton13 = {
        attach: function(context, settings) {
            
            //attach click event to buttons
            $('.show-chart-spme').click(function(){

                $('#spmartab').show(500); 
                $( ".show-chart-spme" ).addClass( "button-hide-spme" );
                $( ".show-chart-spme" ).removeClass( "button-show-spme" );
                $( ".hide-chart-spme" ).removeClass( "button-hide-spme" );
                $( ".hide-chart-spme" ).addClass( "button-show-spme" );

            });

            $('.hide-chart-spme').click(function(){

                $('#spmartab').hide(1000); 
                $( ".hide-chart-spme" ).removeClass( "button-show-spme" );
                $( ".hide-chart-spme" ).addClass( "button-hide-spme" );
                $( ".show-chart-spme" ).removeClass( "button-hide-spme" );
                $( ".show-chart-spme" ).addClass( "button-show-spme" );



            });
        }
    };
})(jQuery);

(function ($) {
     
    Drupal.behaviors.closeopenbutton14 = {
        attach: function(context, settings) {
            
            //attach click event to buttons
            $('.show-chart-amspte').click(function(){

                $('#amsptertab').show(500); 
                $( ".show-chart-amspte" ).addClass( "button-hide-amspte" );
                $( ".show-chart-amspte" ).removeClass( "button-show-amspte" );
                $( ".hide-chart-amspte" ).removeClass( "button-hide-amspte" );
                $( ".hide-chart-amspte" ).addClass( "button-show-amspte" );

            });

            $('.hide-chart-amspte').click(function(){

                $('#amsptertab').hide(1000); 
                $( ".hide-chart-amspte" ).removeClass( "button-show-amspte" );
                $( ".hide-chart-amspte" ).addClass( "button-hide-amspte" );
                $( ".show-chart-amspte" ).removeClass( "button-hide-amspte" );
                $( ".show-chart-amspte" ).addClass( "button-show-amspte" );



            });
        }
    };
})(jQuery);

(function ($) {
     
    Drupal.behaviors.closeopenbutton15 = {
        attach: function(context, settings) {
            
            //attach click event to buttons
            $('.show-chart-bispte').click(function(){

                $('#bisptertab').show(500); 
                $( ".show-chart-bispte" ).addClass( "button-hide-bispte" );
                $( ".show-chart-bispte" ).removeClass( "button-show-bispte" );
                $( ".hide-chart-bispte" ).removeClass( "button-hide-bispte" );
                $( ".hide-chart-bispte" ).addClass( "button-show-bispte" );

            });

            $('.hide-chart-bispte').click(function(){

                $('#bisptertab').hide(1000); 
                $( ".hide-chart-bispte" ).removeClass( "button-show-bispte" );
                $( ".hide-chart-bispte" ).addClass( "button-hide-bispte" );
                $( ".show-chart-bispte" ).removeClass( "button-hide-bispte" );
                $( ".show-chart-bispte" ).addClass( "button-show-bispte" );



            });
        }
    };
})(jQuery);

(function ($) {
     
    Drupal.behaviors.closeopenbutton16 = {
        attach: function(context, settings) {
            
            //attach click event to buttons
            $('.show-chart-maspte').click(function(){

                $('#masptertab').show(500); 
                $( ".show-chart-maspte" ).addClass( "button-hide-maspte" );
                $( ".show-chart-maspte" ).removeClass( "button-show-maspte" );
                $( ".hide-chart-maspte" ).removeClass( "button-hide-maspte" );
                $( ".hide-chart-maspte" ).addClass( "button-show-maspte" );

            });

            $('.hide-chart-maspte').click(function(){

                $('#masptertab').hide(1000); 
                $( ".hide-chart-maspte" ).removeClass( "button-show-maspte" );
                $( ".hide-chart-maspte" ).addClass( "button-hide-maspte" );
                $( ".show-chart-maspte" ).removeClass( "button-hide-maspte" );
                $( ".show-chart-maspte" ).addClass( "button-show-maspte" );



            });
        }
    };
})(jQuery);




