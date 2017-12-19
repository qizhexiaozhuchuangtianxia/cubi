/**
 * 暂时不用，
 * webpack调用babel处理react
 */

'use strict';

var gulp = require('gulp');
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");

var files = "src/pc/**/*.js";

gulp.task("react", function () {
  return gulp.src(files)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("build/pc"));
});

gulp.task('react:watch', function () {
  gulp.watch(files, ['react']);
});