@ECHO OFF

SET NODE_ENV=
set dir="public\build"

rd "%dir%" /s/q

"..\node_modules\.bin\gulp.cmd"  watch

