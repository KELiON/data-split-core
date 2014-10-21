var gulp = require('gulp');
var fs    = require('fs-extra');

gulp.task('clean', function (done) {
  fs.remove(__dirname + '/build', done);
});

gulp.task('build:lib', ['clean'], function () {
  var es6transpiler = require('gulp-es6-transpiler');

  return gulp.src('lib/*.js')
    .pipe(es6transpiler())
    .pipe(gulp.dest('build/lib'));
});

gulp.task('lint:test', function () {
    var jshint = require('gulp-jshint');

    return gulp.src('test/*.js')
        .pipe(jshint({ esnext: true, expr: true }))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('lint:lib', function () {
    var jshint = require('gulp-jshint');

    return gulp.src(['lib/*.js', 'gulpfile.js'])
        .pipe(jshint({ esnext: true }))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('test', ['build:lib'], function () {
  var mocha = require('gulp-mocha');
  return gulp.src('test/*.js', { read: false }).pipe(mocha());
});

gulp.task('lint', ['lint:test', 'lint:lib']);
gulp.task('default', ['build:lib', 'lint', 'test']);