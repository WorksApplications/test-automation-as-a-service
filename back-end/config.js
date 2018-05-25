var yaml = require('js-yaml');
var fs = require('fs');

var doc = {};
try {
  doc = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'));
  console.log('Read configurations from config.yml');
} catch (e) {
  console.log('Failed to read the configuration file.');
  console.log(e);
  process.exit(0);
}

module.exports = doc;