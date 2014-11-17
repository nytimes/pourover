var gulp = require('gulp');
var wrap = require('gulp-wrap-umd');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');

gulp.task('clean', function(cb) {
    del(['dist/*.js']);
    return cb();
});

gulp.task('umd', ['clean'], function(file) {
    var umdPourover = gulp
        .src('pourover.js')
        .pipe(wrap({
        	namespace: 'PourOver',
            exports: 'PourOver',
            deps: [{
                name: 'underscore',
                globalName: '_',
                paramName: '_'
            }]
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('build', ['umd']);
gulp.task('default', ['build']);
