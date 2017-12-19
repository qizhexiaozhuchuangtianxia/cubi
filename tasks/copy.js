'use strict';

/**
 * 静态资源拷贝
 */

var gulp = require('gulp');


gulp.task('copy-libs', function() {
	gulp.src('src/libs/**')
		.pipe(gulp.dest('build/libs/'));
});

gulp.task('copy-guide', function() {
	gulp.src('src/guide/**')
		.pipe(gulp.dest('build/pc/guide'));
});

gulp.task('copy-images', function() {
	gulp.src('src/pc/images/**')
		.pipe(gulp.dest('build/pc/images/'));
});

gulp.task('copy-themes-default-iconfont', function() {
	gulp.src('src/pc/themes/default/iconfont/**')
		.pipe(gulp.dest('build/pc/themes/default/iconfont/'));
});
gulp.task('copy-themes-default-images', function() {
	gulp.src('src/pc/themes/default/images/**')
		.pipe(gulp.dest('build/pc/themes/default/images/'));
});

gulp.task('copy-html', function() {
	gulp.src('src/**/**.html')
		.pipe(gulp.dest('build/'));
});

gulp.task('copy-worker', function() {
    gulp.src('src/workers/**/*.js')
        .pipe(gulp.dest('build/workers'));
});

gulp.task('copy', ['copy-libs', 'copy-guide', 'copy-html', 'copy-images', 'copy-themes-default-iconfont', 'copy-themes-default-images', 'copy-worker']);

gulp.task('copy:watch', function() {
	gulp.watch('src/libs/**', ['copy-libs']);
	gulp.watch('src/guide/**', ['copy-guide']);
	gulp.watch('src/**/*.html', ['copy-html']);
	gulp.watch('src/pc/images/**', ['copy-images']);
	gulp.watch('src/pc/themes/default/iconfont/**', ['copy-themes-default-iconfont']);
	gulp.watch('src/pc/themes/default/images/**', ['copy-themes-default-images']);
});
