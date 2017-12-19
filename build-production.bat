@ECHO OFF

set dir="build"

rd "%dir%" /s/q

SET NODE_ENV=production
SET BABEL_ENV=production

"node_modules\.bin\gulp.cmd"  build

