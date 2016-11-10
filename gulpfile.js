/* eslint-disable */

const gulp = require('gulp')
const babel = require('gulp-babel')
const copy = require('gulp-contrib-copy')
const uglify = require('gulp-uglify')

gulp.task('copy', () => {
    return gulp.src('src/**/*')
        .pipe(copy())
        .pipe(gulp.dest('weapp'))
})

gulp.task('default', [ 'copy' ], () => {
    return gulp.src('src/**/*.js')
        .pipe(babel({
            presets: [ 'es2015' ],
        }))
        .pipe(uglify())
        .pipe(gulp.dest('weapp'))
})
