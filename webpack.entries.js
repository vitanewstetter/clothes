const path = require('path');
const appJsDir = 'source/js';

/**
 * The scripts listed here should match the scripts listed in the flask
 * application's configuration.
 * @type {Array}
 */
const SCRIPTS = ['global'];

/**
 * Creates full path for `entry` and returns multiple
 * entry points array.
 * https://webpack.github.io/docs/multiple-entry-points.html
 *
 * @param {string} entry - Path for JS entry
 * @param {Object} opts
 * @param {boolean} opts.includeGlobal Whether to concatenate the global script
 * @return {Array} - Webpack entry points for `entry`
 */
function formatEntry(entry, {includeGlobal = true} = {}) {
  const _path = (filename) => path.join(__dirname, appJsDir, filename);
  const entries = [];

  if (includeGlobal) entries.push(_path('global.js'));

  entries.push(_path(entry));
  return entries;
}

exports.appJsDir = appJsDir;
exports.entries = SCRIPTS.reduce(function(scripts, filename) {
  const opts = {includeGlobal: true};

  // The `global` script is a special case because it must be present on every
  // page. It will be injected into the page if no other bundle is specified.
  // Therefore, we need to make sure the file is not duplicated in the bundle.
  if (filename === 'global') opts.includeGlobal = false;

  scripts[filename] = formatEntry(filename + '.js', opts);
  return scripts;
}, {});
