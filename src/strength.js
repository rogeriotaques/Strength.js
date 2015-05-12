/*!
 * strength.js
 * 
 * Original author: @aaronlumsden
 * Further changes, comments: @aaronlumsden
 * 
 * Enhanced by Rogerio Taques (rogerio.taques@gmail.com)
 * Added new default options which include the ability to translate labels and password strengths.
 * Changed options parameters becoming it more intuitive.
 * 
 * Version: custom 1.0
 * 
 * Licensed under the MIT license
 */
;(function ( $, window, document, undefined ) {

    var pluginName = "strength",
        
        defaults = {
            targetClass: 'strength',
            strengthMeterClass: 'strength_meter',
            showPasswordButtonClass: 'show_password_strength',
            texts: {
                showPassword: 'Show Password',
                hidePassword: 'Hide Password',
                strengthInitialLabel: 'Strength',
                strengthVeryWeakLabel: 'Very weak',
                strengthWeakLabel: 'Weak',
                strengthMediumLabel: 'Medium',
                strengthStrongLabel: 'Strong'
            }
        };

    function Plugin( element, options ) 
    {
        this.element = element;
        this.$elem = $(this.element);
        this.options = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {

        init: function() 
        {
            var $this           = this,
                characters      = 0,
                capitalletters  = 0,
                loweletters     = 0,
                number          = 0,
                special         = 0,
                upperCase       = new RegExp('[A-Z]'),
                lowerCase       = new RegExp('[a-z]'),
                numbers         = new RegExp('[0-9]'),
                specialchars    = new RegExp('([!,%,&,@,#,$,^,*,?,_,~])');

            function getPercentage(a, b) 
            {
                return ((b / a) * 100);
            }

            function checkStrength(thisval, thisid, thisopts)
            {
                if (!thisval.length) 
                { 
                    total = -1; 
                }
                
                else
                {
                    characters      = ( thisval.length > 8 ? 1 : -1 );
                    capitalletters  = ( thisval.match(upperCase) ? 1 : 0 );
                    loweletters     = ( thisval.match(lowerCase) ? 1 : 0 );
                    number          = ( thisval.match(numbers) ? 1 : 0 );
                    special         = ( thisval.match(specialchars) ? 1 : 0 );

                    var total = characters + capitalletters + loweletters + number + special,
                        totalpercent = getPercentage(5, total).toFixed(0);
                    
                }
                    
                getTotal(total, thisid, thisopts);
            }

            function getTotal(total, thisid, thisopts)
            {

                var thismeter = $('div[data-meter="'+thisid+'"].' + thisopts.strengthMeterClass);
                
                // remove metered classes
                thismeter.removeClass('veryweak weak medium strong');
                
                if (total <= 1) 
                {
                   thismeter
                       .addClass('veryweak')
                       .find('div.meter_label').html( thisopts.texts.strengthVeryWeakLabel );
                } 
                else if (total == 2)
                {
                    thismeter
                        .addClass('weak')
                        .find('div.meter_label').html( thisopts.texts.strengthWeakLabel );
                } 
                else if(total == 3)
                {
                    thismeter
                        .addClass('medium')
                        .find('div.meter_label').html( thisopts.texts.strengthMediumLabel );
                } 
                else 
                {
                    thismeter
                        .addClass('strong')
                        .find('div.meter_label').html( thisopts.texts.strengthStrongLabel );
                }
                
                if (total == -1) 
                { 
                    thismeter
                        .removeClass('veryweak weak medium strong')
                        .find('div.meter_label').html( thisopts.texts.strengthInitialLabel );
                }
            }

            var isShown = false,
                showPasswordButtonText = this.options.texts.showPasswordPassword,
                hidePasswordButtonText = this.options.texts.hidePassword,
                thisid  = this.$elem.attr('id'),
                thisval = '';

            this.$elem.addClass(this.options.targetClass).attr('data-password', thisid).after(
                '<a data-password-button="'+thisid+'" href="#" class="' + $this.options.showPasswordButtonClass+'">' + $this.options.texts.showPassword + '</a>' + 
                '<div class="' + $this.options.strengthMeterClass + '" data-meter="' + thisid + '" >' +
                '<div class="meter_progress" ></div>' +  
                '<div class="meter_label" >' + $this.options.texts.strengthInitialLabel + '</div>' +
                '</div>'
            );
             
            this.$elem.on('keyup keydown', function(event) 
            {
                thisval = $('#'+thisid).val();
                checkStrength(thisval, thisid, $this.options);
                
            });

            $(document.body).on('click', '.' + this.options.showPasswordButtonClass, function(e) 
            {
                e.preventDefault();
                var thisclass = 'hide_' + $(this).attr('class');
                
                $( '#' + thisid ).attr('type', ( isShown ? 'password' : 'text' ));
                isShown = !isShown;
            });

        },

        yourOtherFunction: function(el, options) 
        {
            // some logic
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) 
    {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) 
            {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );


