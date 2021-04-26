

'use strict';


$(function()
{

    function getSearchParams(search){
        var params={};
        location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,search,v){params[search]=v})
        for(let param in params){
            $.cookie(param,params[param])
        }

        return search?params[search]:params;
    }

    $("#phone").intlTelInput({
        initialCountry: 'ae',
        preferredCountries: ['ae','us','gb','br','ru','cn','es','it'],
        autoPlaceholder: 'aggressive',
        hiddenInput: "full",
        geoIpLookup: function (callback) {
            $.get('https://ipinfo.io', function () {
            }, "jsonp").always(function (resp) {
                var countryCode = (resp && resp.country) ? resp.country : "";
                callback(countryCode);
            });
        },
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/11.0.14/js/utils.js"
    });
    

    $('#contact').submit(function(e)
    {
        e.preventDefault();

        let utm_params = getSearchParams()
        var formData = {
            name: $("#name").val(),
            email: $("#email").val(),
            phone: $("#phone").val(),
            code:$("#phone").intlTelInput("getSelectedCountryData").dialCode,
            utm_params:utm_params
        };

        
        $.ajax({
            type: 'POST',
            url: '/lead-form',
            data: formData,
            success: after_form_submitted,
            error: function (err) {
                after_form_submitted()
                console.log('An error occurred.');
                console.log(err);
            }
        });



    });


    function after_form_submitted(data)
    {
        console.log("data",data)
        if(data && data.result == 'success')
        {
            $('form#contact')[0].reset();
            $('#success-message').show();
            $('#error-message').hide();
        }
        else
        {
            $('#error-message').text(data?data.message:"Error");
            $('#success-message').hide();
            $('#error-message').show();
            
        }
    }


});

