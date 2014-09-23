$('#new-loc-form').submit(function(event) {
  event.preventDefault();

  $('#loc-submit').toggleClass('disabled').html('Loading...');

  var $form = $(this);
  var posting = $.post('/api/locations', $form.serialize()); 

  posting.fail(function(jqXHR, textStatus) {
    alert('Submission failed: ', textStatus);
    $('#loc-submit').toggleClass('disabled').html('Try Submitting Again');
  });

  posting.success(function(data) {
    if (data.ok = true) {
      alert('Submission successful!');
      window.location.replace('/new');
    } else {
      alert('Submission failed: ', data);
      $('#loc-submit').toggleClass('disabled').html('Try Submitting Again');
    }
  });

});
