'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

var files = "src/pc/themes/**/*.scss";

gulp.task("sass", function () {
  return gulp.src(files)  
    .pipe(sass().on('error', sass.logError))    
    .pipe(gulp.dest("build/pc/themes"));
});

gulp.task('sass:watch', function () {
  gulp.watch(files, ['sass']);
});