$('#new-loc-form').submit(function(e) {

  e.preventDefault();

  var formData = $('#new-loc-form').serialize();

  $.ajax({
    type: 'POST',
    url: '/new',
    data: formData,
  }).done(function(msg) {
    console.log('sent data:', formData);
  });

});
