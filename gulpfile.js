'use strict';

const gulp = require('gulp');


// Required
const { src, dest, series, parallel, watch, lastRun } = require('gulp');


//Fractal
const fractal = require('./fractal.config.js')
const logger = fractal.cli.console;

// MISC
const plumber = require('gulp-plumber');
const notify = require("gulp-notify");
const merge = require('merge-stream');


//CSS
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');


//HTML
const embedSvg = require('gulp-embed-svg');




// Path variable
var source = 'src'; //Working folder
var prod = 'dist'; //Final folder



/*
* CSS task
* SASS + autoprefixer + sourcemaps
*/
function css() {

  var app = src([source + '/assets/styles/scss/styles.scss'], { sourcemaps: true })
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(sass({
      outputStyle: 'expanded',
      includePaths: ['node_modules/']
    }))
    .pipe(autoprefixer())
    .pipe(dest([source + '/assets/styles/css/'], {sourcemaps: '/map'}));

    return merge(app);
};




/*
* Embed SVG
* input in html <svg src="github-icon.svg" class="inline-svg"></svg> Or  <img src="github-icon.svg" class="inline-svg"/>
* output : <svg class="inline-svg"><!-- svg markup from github-icon.svg --></svg>
*/
function embed_svg() {
  return src([source + '/*.html'])
    .pipe(embedSvg({
      selectors: '.inline-svg', // only replace tags with the class inline-svg
      attrs: /class/ // only transfer/preserve class attribute
    }))
    .pipe(dest(prod));
}









/*
 * Start the Fractal server
 *
 * In this example we are passing the option 'sync: true' which means that it will
 * use BrowserSync to watch for changes to the filesystem and refresh the browser automatically.
 * Obviously this is completely optional!
 *
 * This task will also log any errors to the console.
 */

gulp.task('fractal:start', function(){
  const server = fractal.web.server({
    sync: true
  });
  server.on('error', err => logger.error(err.message));
  return server.start().then(() => {
    logger.success(`Fractal server is now running at ${server.url}`);
  });
});

/*
 * Run a static export of the project web UI.
 *
 * This task will report on progress using the 'progress' event emitted by the
 * builder instance, and log any errors to the terminal.
 *
 * The build destination will be the directory specified in the 'builder.dest'
 * configuration option set above.
 */

gulp.task('fractal:build', function(){
  const builder = fractal.web.builder();
  builder.on('progress', (completed, total) => logger.update(`Exported ${completed} of ${total} items`, 'info'));
  builder.on('error', err => logger.error(err.message));
  return builder.build().then(() => {
    logger.success('Fractal build completed!');
  });
});





/*
* Public function
*/

exports.css = css;