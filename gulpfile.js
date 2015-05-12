var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var handlebars = require('gulp-handlebars');
var package = require('./package.json');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var concat = require('gulp-concat');
var devservr = require('devservr');
var log = require('gulp/node_modules/gulp-util').log;

gulp.task('default', function() {
  var filename = package.name +'-'+ package.version +'.min.js';
  gulp.src('src/**/*.js')
    .pipe(uglify())
    .pipe(rename(filename))
    .pipe(gulp.dest('dist/')).on('end', function() {
      log('File created dist/'+ filename);
    });

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
