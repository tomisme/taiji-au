$('#new-location-form').submit(function(e) {

  e.preventDefault();

  var formData = $('#new-location-form').serialize();

  $.ajax({
    type: 'POST',
    url: '/new',
    data: formData,
  }).done(function(msg) {
    console.log('sent data:', formData);
  });

});
