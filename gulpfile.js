var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var handlebars = require('gulp-handlebars');
var package = require('./package.json');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var concat = require('gulp-concat');
var devservr = require('devservr');
var clean = require('gulp-clean');
var log = require('gulp/node_modules/gulp-util').log;

function build() {
  var filename = package.name +'-'+ package.version +'.min.js';

  gulp.src('src/**/*.js')
  .pipe(uglify())
  .pipe(rename(filename))
  .pipe(gulp.dest('dist/')).on('end', function() {
    log('File created dist/'+ filename);
  })
  .pipe(rename('nervespine.min.js'))
  .pipe(gulp.dest('dist/')).on('end', function() {
    log('File created dist/nervespine.min.js');
  });
}

gulp.task('default', function() {
  return gulp.src('dist/*.js')
    .pipe(clean())
    .on('end', build);
});

gulp.task('test', function () {
  gulp.src(['test/page/*.hbs'])
  .pipe(handlebars())
  .pipe(wrap('Handlebars.template(<%= contents %>)'))
  .pipe(declare({
    namespace: 'app.template',
    noRedeclare: true, // Avoid duplicate declarations
  }))
  .pipe(concat('test.tpl.js'))
  .pipe(gulp.dest('test')).on('end', function() {
    devservr.start({routefile : 'routes.json'});
  });
  // open http://localhost/test/runner.html
});
