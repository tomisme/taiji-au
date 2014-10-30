var gulp = require('gulp');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var react = require('gulp-react');
var rimraf = require('rimraf');

var client = {
  jsx: './public/src/*.jsx',
  dist: './public/dist'
};


gulp.task('clean', function(cb) {
  rimraf(dist, cb);
});

gulp.task('js', function() {

  var browserified = transform(function(filename) {
    var b = browserify({ debug: !process.env.NODE_ENV });
    return b.bundle();
  });

  return gulp.src(client.jsx)
    .pipe(react())
    .pipe(gulp.dest(client.dist));
});
