'use strict';

var	gulp = require('gulp'),
	browserify = require('browserify'),
	jadeify = require('jadeify'),
	buffer = require('vinyl-buffer'),
	source = require('vinyl-source-stream'),
  jasmineBrowser = require('gulp-jasmine-browser'),
  watch = require('gulp-watch'),

	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish'),

	stylus = require('gulp-stylus'),
	concat = require('gulp-concat-css'),
	nib = require('nib'),

	minify = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),

	watchify = require('watchify'),
	assign = require('lodash.assign'),

  livereload = require('gulp-livereload'),
  serve = require('gulp-serve');

var Server = require('karma').Server;

gulp.task('karma', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
  }, done).start();
});

var opts = {
    entries: './app/app.js',
    transform: [jadeify]
  }

opts = assign({}, watchify.args, opts);

gulp.task('serve', serve('www'));

gulp.task('build', ['styl', 'js']);

gulp.task('js', function() {
  return generateBundle(browserify(opts));
});


gulp.task('test', function () {
  var testFiles = ['./app/**/*.js', './spec/*.js'];
  return gulp.src(testFiles)
    .pipe(watch(testFiles))
    .pipe(livereload({ start: true }))
    .pipe(jasmineBrowser.specRunner())
    .pipe(jasmineBrowser.server({port: 8080}));
});


gulp.task('jshint', function() {
 return gulp.src('./app/**/*.js')
  .pipe(jshint('.jshintrc'))
   .pipe(jshint.reporter('jshint-stylish'))
   .pipe(jshint.reporter('fail'));
});

function styl () {
  return gulp.src('./app/app.styl')
    .pipe(stylus({ use: nib() }))
    .pipe(concat('app.css'))
    // .pipe(minify())
    .pipe(gulp.dest('./www/css'));
}

gulp.task('styl', function () {
  return styl();
});

gulp.task('styl:livereload', function () {
  return styl().pipe(livereload({ start: true }));
});

gulp.task('styl:watch', ['styl:livereload'], function () {
  return gulp.watch(['./app/app.styl','./app/**/*.styl'], ['styl:livereload']);
});

gulp.task('jshint:watch', function () {
  return gulp.watch(['./app/**/*.js', './app/app.js']);
});


gulp.task('js:watch', function() {
  var w = watchify(browserify(opts));

  w.on('update', function (file) {
    console.log('file modified: %s, rebuilding...', file);
    var b = generateBundle(w).pipe(livereload())
    console.log('rebuilt')
    return b
  });

  return generateBundle(w)
    .pipe(livereload({ start: true }));

});

gulp.task('watch', ['js:watch', 'styl:watch', 'jshint:watch']);
gulp.task('default', ['watch', 'jshint', 'build', 'serve', 'test']);

function generateBundle(b) {
  return b
  .bundle()
  .pipe(source('app.js'))
  .pipe(buffer())
  //.pipe(uglify())
  .pipe(gulp.dest('./www/'))
}

