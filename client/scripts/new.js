$(document).ready(function(){

  var address = "";
  var hasAddress = true;

  function handleHasAddressChange(event) {
    $('#geoloc-submit').toggleClass('disabled');
    if ($(this).is(':checked')) {
      hasAddress = false;
      $('#geoloc-results').html("");
      address = "";
    } else {
      hasAddress = true;
    }
  }

  function handleGeolocSubmit(event) {
    event.preventDefault();

    $('#geoloc-submit').toggleClass('disabled').html('Searching...');

    var $form = $(this);

    var posting = $.post('/api/geoloc', $form.serialize())
      .done(function(data) {
        if (data.error) {
          alert('There was an error with your location search, please check your input and try again.');
          $('#geoloc-submit').toggleClass('disabled').html('Search');
        } else {
          var html = "";

          data.forEach(function(loc, index) {
            html += "<div data-loc='" + JSON.stringify(loc) + "' class='panel panel-default geoloc-option' id='loc-" + index + "'>";
            html += "<div class='panel-body'>";
            html += "<p><b>Country:</b> " + loc.country + "<p>";
            html += "<p><b>State:</b> " + loc.state + "</p>";
            html += "<p><b>City:</b> " + loc.city + "</p>";
            html += "<p><b>Street Name</b>: " + loc.streetName + "</p>";
            html += "<p><b>Street Number</b>: " + loc.streetNumber + "</p>";
            html += "<p><b>Zipcode:</b> " + loc.zipcode + "</p>";
            html += "</div>";
            html += "</div>";
            $('#loc-' + index)
              .data('chosen', false);

          });

          $('#geoloc-results').html(html);
            
          $('.geoloc-option').click(function() {
            if (!$(this).data('chosen')) {
              $('.geoloc-option')
                .removeClass('panel-primary')
                .addClass('panel-default')
                .data('chosen', false);

              $(this)
                .addClass('panel-primary')
                .removeClass('panel-default')
                .data('chosen', true);

              address = $(this).attr('data-loc');
            }
          });


          $('#geoloc-submit').toggleClass('disabled').html('Search');
        }
      })
      .fail(function(jqXHR, textStatus, err) {
        console.log(jqXHR, textStatus, err);
        alert('Could not contact server, please try again later');
        $('#loc-submit').toggleClass('disabled').html('Try Submitting Again');
      });
  }

  function handleLocSubmit(event) {
    var locationData;
    var details = $(this).serializeObject();

    event.preventDefault();

    $('#loc-submit').toggleClass('disabled').html('Submitting...');

    if (!address && hasAddress) {
      alert("Please search and select an address or select 'Online Only'");
      $('#loc-submit').toggleClass('disabled').html('Submit');
      return;
    }

    if (!details.name) {
      alert('Please provide a name for the location');
      $('#loc-submit').toggleClass('disabled').html('Submit');
      return;
    }

    if (hasAddress) {
      locationData = JSON.parse(address);
    } else {
      locationData = {
        country: $('#country').val(),
        state: $('#state').val(),
        city: $('#city').val(),
        street: $('#street').val(),
        postcode: $('#postcode').val()
      };
    }

    locationData.hasAddress = hasAddress;

    for (var prop in details) {
      locationData[prop] = details[prop];
    }

    $.post('/api/locations', locationData)
      .done(function(data) {
        if (data.success) {
          alert('Submission successful!');
          window.location.replace('/admin/new');
        } else {
          alert('There was an error with the ' + data.error);
          $('#loc-submit').toggleClass('disabled').html('Submit');
        }
      })
      .fail(function(jqXHR, textStatus, err) {
        console.log(err);
        alert('Submission failed with status: ', textStatus);
        $('#loc-submit').toggleClass('disabled').html('Try Submit');
      });
  }

  $('#online-only-checkbox').change(handleHasAddressChange);
  $('#geoloc-form').submit(handleGeolocSubmit);
  $('#new-loc-form').submit(handleLocSubmit);

});
