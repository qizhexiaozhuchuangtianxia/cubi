@ECHO OFF

set dir="build"

rd "%dir%" /s/q

start /i "CuBI 2.0" "node_modules\.bin\gulp.cmd"  watch

