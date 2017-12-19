var gulp = require('gulp');

require('./tasks/sass');
require('./tasks/copy');
require('./tasks/webpack');

gulp.task('default', ['copy']);
gulp.task('build', ['default', 'cubi.libs.bundle', 'cubi.bundle','sass']);

gulp.task('watch', ['build', 'copy:watch','sass:watch','cubi.bundle:watch']);
gulp.task('share', ['build','sdk.bundle']);


