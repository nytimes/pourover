#!/bin/sh

git pull --commit origin gh-pages
git checkout master examples
jekyll build
docco _site/examples/*.js -o _site/examples/examples_build
git commit -am "JEKYLL BUILD"
git push origin gh-pages
