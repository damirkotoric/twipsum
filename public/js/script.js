function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(function() {
  document.querySelector('#search > input').focus()
  document.querySelector('#search').addEventListener('submit', doSearch)
  fetchTwipsum("@realDonaldTrump")
})

function fetchTwipsum(query) {
  var request = new XMLHttpRequest();
  request.open('POST', '/'+query, true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var data = JSON.parse(request.responseText);
      var generatorContainer = document.querySelector('.generator')
      generatorContainer.classList.remove('-is-loading')
      // Extract desired text from JSON feed
      var html = '<p>'
      Array.prototype.forEach.call(data, function(el, i){
        html += el.text
      });
      html += '</p>'
      // Update UI
      var twipsumShareLink = document.querySelector('#share-twipsum')
      twipsumShareLink.setAttribute('href', query)
      twipsumShareLink.querySelector('span').innerHTML = 'twipsum.net/' + query
      var twipsumContainer = document.querySelector('.generator__twipsum > .-loaded')
      twipsumContainer.innerHTML = html
    } else {
      // We reached our target server, but it returned an error

    }
  };
  request.onerror = function() {
    // There was a connection error of some sort
  };
  request.send();
}

function doSearch(e) {
  event.preventDefault()
  // TODO: Implement search
}
