function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(function() {
  // Listeners
  document.querySelector('#search').addEventListener('submit', doSearch)
  document.querySelector('#copy-twipsum').addEventListener('click', copyTwipsumToClipboard)

  // Init
  document.querySelector('#search > input').focus()
  var pathname = window.location.pathname.replace('/','')
  if (pathname != '') {
    // We're dealing with a search
    fetchTwipsum(pathname)
  } else {
    // We're dealing with a home page request
    var defaultUser = document.querySelector('.intro__suggestions li:first-child > a').getAttribute('href').replace('/','')
    document.querySelector('.intro__suggestions li:first-child').classList.add('-active')
    fetchTwipsum(defaultUser)
  }
})

function fetchTwipsum(query) {
  var request = new XMLHttpRequest();
  request.open('POST', '/'+query, true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400 && request.responseText) {
      // Success!
      var data = JSON.parse(request.responseText)
      var generatorContainer = document.querySelector('.generator')
      generatorContainer.classList.remove('-is-loading')
      // Extract desired text from JSON feed
      var html = '<p>'
      Array.prototype.forEach.call(data, function(el, i) {
        if (i != 0 && i % 5 === 0) {
          html += formatText(el.full_text)
          html += '</p><p>'
        } else if (i === data.length -1) {
          html += formatText(el.full_text)
          html += '</p>'
        } else {
          html += formatText(el.full_text) + ' '
        }
      });
      // Update UI
      var twitterProfile = document.querySelector('#twitter-profile')
      twitterProfile.setAttribute('href', 'https://twitter.com/'+query)
      var twitterProfileImage = document.querySelector('#twitter-profile > img')
      twitterProfileImage.setAttribute('src', data[0].user.profile_image_url.replace('_normal', ''))
      var twipsumShareLink = document.querySelector('#share-twipsum')
      twipsumShareLink.setAttribute('href', query)
      twipsumShareLink.querySelector('span').innerHTML = 'twipsum.net/' + query
      var twipsumContainer = document.querySelector('.generator__twipsum > .-loaded')
      twipsumContainer.innerHTML = html
      var popularTwipsums = document.querySelectorAll('.intro__suggestions li')
      Array.prototype.forEach.call(popularTwipsums, function(el, i) {
        if (el.querySelector('a').getAttribute('href').replace('/','') === query) {
          el.querySelector('a').classList.add('-active')
        }
      })
    } else {
      // We reached our target server, but it returned an error
      showError('not found')
    }
  };
  request.onerror = function() {
    // There was a connection error of some sort
    showError('server error')
  };
  request.send();
}

function formatText(text) {
  // Remove URLs
  var newText = text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
  return newText
}

function copyTwipsumToClipboard(e) {
  e.preventDefault()
  var textArea = document.createElement("textarea")
  textArea.style.opacity = 0
  var copyTextElement = document.querySelector('.generator__twipsum > .-loaded')
  var textToCopy = copyTextElement.innerText || copyTextElement.textContent
  textArea.value = textToCopy
  document.body.appendChild(textArea)
  textArea.select()
  try {
    var successful = document.execCommand('copy')
    document.querySelector('#copy-twipsum > div:nth-child(1)').style.display = 'none'
    document.querySelector('#copy-twipsum > div:nth-child(2)').style.display = 'flex'
    setTimeout( function() {
      document.querySelector('#copy-twipsum > div:nth-child(1)').style.display = 'flex'
      document.querySelector('#copy-twipsum > div:nth-child(2)').style.display = 'none'
    }, 1000)
  } catch (err) {
    console.log('Lorem shitsum! Unable to copy text to clipboard.')
  }
  document.body.removeChild(textArea)
}

function doSearch(e) {
  event.preventDefault()
  var username = document.querySelector('#search > input').value.replace('@','')
  window.location.href = '@'+username
}

function showError(errorType) {
  document.querySelector('.generator').classList.add('-is-error')
  if (errorType === 'not found') {
    document.querySelector('.-error-not-found').style.display = 'block'
  }
  if (errorType === 'server error') {
    document.querySelector('.-error-server').style.display = 'block'
  }
}
