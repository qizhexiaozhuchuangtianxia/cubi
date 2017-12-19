#!/usr/bin/env zsh

set -e
set -x

cwd=`dirname $0`
dir=$cwd/public/build

rm -rf $dir

export NODE_ENV=
$cwd/node_modules/.bin/gulp watch
