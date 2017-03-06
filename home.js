// ------------map menu slider------------
(function ($) {
    Drupal.behaviors.counter= {
        attach: function(context, settings) {
            $('.patop').on('click', function() {
            	$parent_box = $(this).closest('.pabox');
            	$parent_box.siblings().find('.pabottom').slideUp();
            	$parent_box.find('.pabottom').slideToggle( "slow" );
            });
        }
    };
})(jQuery);
// ------------WDPA - Country - Ecoregion - Region  Slider delay slide up------------
(function ($) {
    Drupal.behaviors.mapmenuwdpa= {
        attach: function(context, settings) {
            $('.middlewdpa').click(function() {
            	$('.inactive, .active').toggle();
                          $parent_box.find('.pabottom').delay(3000).fadeToggle();
            });
        }
    };
})(jQuery);
(function ($) {
    Drupal.behaviors.mapmenucountry= {
        attach: function(context, settings) {
          	$('.middlecountry').click(function() {
          		$('.inactive1, .active1').toggle();
                          $parent_box.find('.pabottom').delay(3000).fadeToggle();
            });
        }
    };
})(jQuery);
(function ($) {
    Drupal.behaviors.mapmenueco= {
        attach: function(context, settings) {
            	$('.middleeco').click(function() {
            		$('.inactive3, .active3').toggle();
                          $parent_box.find('.pabottom').delay(3000).fadeToggle();
              });
        }
    };
})(jQuery);
(function ($) {
    Drupal.behaviors.mapmenureg= {
        attach: function(context, settings) {
          	$('.middlereg').click(function() {
          		$('.inactive4, .active4').toggle();
                          $parent_box.find('.pabottom').delay(3000).fadeToggle();
            });
        }
    };
})(jQuery);
//----------------------------Moove WDPA Search and Location Search-----------------------------------------------
(function ($) {
    Drupal.behaviors.moovesearchwdpa= {
        attach: function(context, settings) {
          setTimeout(function(){
           $('input[placeholder="Protected Area...          "]').closest('div.leaflet-control-search').appendTo('div#wdpafilter')
           }, 200);
        }
    };
})(jQuery);
(function ($) {
    Drupal.behaviors.moovesearchlocation= {
        attach: function(context, settings) {
          setTimeout(function(){
           $('input[placeholder="Location...                "]').closest('div.leaflet-control-search').appendTo('div#locationfilter')
           }, 200);
        }
    };
})(jQuery);
//----------------------------Moove WDPA - Country - Ecoregion - Region legend-----------------------------------------------
(function ($) {
    Drupal.behaviors.wdpalegendbox= {
        attach: function(context, settings) {
        setTimeout(function(){
         $('#wdpalegend').closest('div.leaflet-control').appendTo('div#wdpalegendbox')
         }, 200);
        }
    };
})(jQuery);
(function ($) {
    Drupal.behaviors.countrylegendbox= {
        attach: function(context, settings) {
        setTimeout(function(){
         $('#countrylegend').closest('div.leaflet-control').appendTo('div#countrylegendbox')
         }, 200);
        }
    };
})(jQuery);
(function ($) {
    Drupal.behaviors.ecolegendbox= {
        attach: function(context, settings) {
        setTimeout(function(){
         $('#ecolegend').closest('div.leaflet-control').appendTo('div#ecolegendbox')
         }, 200);
        }
    };
})(jQuery);
(function ($) {
    Drupal.behaviors.reglegendbox= {
        attach: function(context, settings) {
        setTimeout(function(){
         $('#regionlegend').closest('div.leaflet-control').appendTo('div#regionlegendbox')
         }, 200);
        }
    };
})(jQuery);


//----------------------------DRUPAL Global Search PLACEHOLDER-----------------------------------------------
(function ($) {
    Drupal.behaviors.search= {
        attach: function(context, settings) {
          document.getElementById("edit-title").placeholder = "TYPE YOUR SEARCH HERE...";
        }
    };
})(jQuery);

// ------------COUNTER UP------------
(function ($) {
    Drupal.behaviors.mapmenu= {
        attach: function(context, settings) {
            $('.counter').counterUp({
                delay: 10,
                time: 1000
            });
        }
    };
})(jQuery);
