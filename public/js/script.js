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
})

function doSearch(e) {
  event.preventDefault()
  // TODO: Implement search
}
