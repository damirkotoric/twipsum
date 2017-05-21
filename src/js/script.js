function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn)
  }
}

ready(function() {
  document.querySelector('#twitter-profile > img').setAttribute('onerror', 'highResImageNotLoaded(this)')
  // Attach FastClick
  var attachFastClick = Origami.fastclick
  attachFastClick(document.body)

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
  var request = new XMLHttpRequest()
  request.open('POST', '/'+query, true)
  request.onload = function() {
    if (request.status >= 200 && request.status < 400 && request.responseText) {
      // Success!
      var data = JSON.parse(request.responseText)
      var generatorContainer = document.querySelector('.generator')
      generatorContainer.classList.remove('-is-loading')
      // Extract desired text from JSON feed
      var html = '<p>'
      Array.prototype.forEach.call(data.tweets, function(el, i) {
        if (i != 0 && i % 5 === 0) {
          html += el.tweet
          html += '</p><p>'
        } else if (i === data.length -1) {
          html += el.tweet
          html += '</p>'
        } else {
          html += el.tweet + ' '
        }
      });
      // Update UI
      var twitterProfile = document.querySelector('#twitter-profile')
      twitterProfile.setAttribute('href', 'https://twitter.com/'+query)
      var twitterProfileImage = document.querySelector('#twitter-profile > img')
      twitterProfileImage.setAttribute('src', data.profile_image_url.replace('_normal', ''))
      var twipsumShareLink = document.querySelector('#share-twipsum')
      twipsumShareLink.setAttribute('href', '/'+query)
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

function copyTwipsumToClipboard(e) {
  e.preventDefault()
  var clipboard = new Clipboard('#copy-twipsum')
  clipboard.on('success', function(e) {
    e.clearSelection()
    document.querySelector('#copy-twipsum > div:nth-child(1)').style.display = 'none'
    document.querySelector('#copy-twipsum > div:nth-child(2)').style.display = 'flex'
    setTimeout( function() {
      document.querySelector('#copy-twipsum > div:nth-child(1)').style.display = 'flex'
      document.querySelector('#copy-twipsum > div:nth-child(2)').style.display = 'none'
    }, 1000)
  })
  clipboard.on('error', function(e) {
    console.log('Lorem shitsum! Unable to copy text to clipboard. ' + e)
  })
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

function highResImageNotLoaded(img) {
  // For some reason the Twitter API isn't returning
  // The Orange Man's mugshot. So this function handles cases
  // where the larger profile can't be loaded.
  var imgSrc = img.getAttribute('src')
  // Appending _bigger to the end of the image name gives,
  // weirdly enough, a smaller fallback image.
  img.setAttribute('src', imgSrc.replace('.jpg', '_bigger.jpg'))
}
