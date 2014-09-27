$(document).ready(function(){

  var locationData = {};

  $('#geoloc-form').submit(function(event) {
    event.preventDefault();

    $('#geoloc-submit').toggleClass('disabled').html('Searching...');

    var $form = $(this);

    var posting = $.post('/api/geoloc', $form.serialize())
      .done(function(data) {
        if (data.error) {
          alert('There was an error with your location search, please check your input and try again.');
          $('#geoloc-submit').toggleClass('disabled').html('Search');
        } else {
          data.forEach(function(loc, index) {
            var html = "";
            html += "<div class='panel panel-default geoloc-option' id='loc-" + index + "'>";
            html += "<div class='panel-body'>";
            html += "<p> Country: " + loc.country + "<p>";
            html += "<p> State: " + loc.state + "</p>";
            html += "<p> Street Name: " + loc.streetName + "</p>";
            html += "<p> Street Number: " + loc.streetNumber + "</p>";
            html += "<p> Zipcode: " + loc.zipcode + "</p>";
            html += "</div>";
            html += "</div>";
            $('#geoloc-results').append(html)
            $('#loc-' + index).data('details', loc);
          });

          var $option = $('.geoloc-option').data('chosen', false);

          $option.click(function() {
            if (!$(this).data('chosen')) {
              $('.geoloc-option')
                .removeClass('panel-primary')
                .addClass('panel-default')
                .data('chosen', false);

              $(this)
                .addClass('panel-primary')
                .removeClass('panel-default')
                .data('chosen', true);

              locationData = $(this).data('details');
            }
          });

          /*
          $option.hover(
            function() {
              $(this)
                .addClass('panel-primary')
                .removeClass('panel-default');
            },
            function() {
              $(this)
                .removeClass('panel-primary')
                .addClass('panel-default');
            }
          );
          */

          $('#geoloc-submit').toggleClass('disabled').html('Search');
        }
      })
     .fail(function(jqXHR, textStatus, err) {
        console.log(jqXHR, textStatus, err);
        alert('Could not contact server, please try again later');
        $('#loc-submit').toggleClass('disabled').html('Try Submitting Again');
      });
  });

  $('#new-loc-form').submit(function(event) {
    event.preventDefault();

    $('#loc-submit').toggleClass('disabled').html('Submitting...');

    var formArray = $(this).serializeArray();

    for (var i in formArray) {
      locationData[formArray[i].name] = formArray[i].value;
    };

    console.log(locationData);

    $.post('/api/locations', locationData)
      .done(function(data) {
        if (data.success) {
          alert('Submission successful!');
          window.location.replace('/new');
        } else {
          alert('There was an error with the ' + data.error);
          $('#loc-submit').toggleClass('disabled').html('Try Submitting Again');
        }
      })
      .fail(function(jqXHR, textStatus, err) {
        console.log(err);
        alert('Submission failed with status: ', textStatus);
        $('#loc-submit').toggleClass('disabled').html('Try Submitting Again');
      });
  });
});
