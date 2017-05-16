var fs = require('fs')

// mergeValues function from Treehouse course. Keeping here
// in case I decide to make the site more SEO friendly
// by serving cached static pages prefilled with Twipsum.
// function mergeValues(values, content) {
//   // Cycle over the keys.
//   for (var key in values) {
//     // Replace all {{key}} with the values from the values object.
//     content = content.toString().replace('{{' + key + '}}', values[key])
//   }
//   // Return merged content.
//   return content;
// }

function view(templateName, values, res) {
  // Read from the template file.
  var fileContents = fs.readFileSync('./views/' + templateName + '.html', {encoding: 'utf8'})
  // Insert values into the content.
  // fileContents = mergeValues(values, fileContents)
  // Write out contents to the response.
  res.write(fileContents)
}

module.exports.view = view
