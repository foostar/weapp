/* eslint-disable */

const gulp = require('gulp')
const path = require('path')
const babel = require('gulp-babel')
const copy = require('gulp-contrib-copy')
const uglify = require('gulp-uglify')
const insert = require('gulp-insert')

gulp.task('copy', () => {
    return gulp.src('src/**/*')
        .pipe(copy())
        .pipe(gulp.dest('weapp'))
})


            // insert.prepend()
gulp.task('default', [ 'copy' ], () => {
    return gulp.src('src/**/*.js')
        .pipe(insert.transform(function(contents, file) {
            const sp = file.path
            const dp = path.join(__dirname, './src/lib/promise.js')
            if (sp === dp) return contents
            let pp = path.relative(file.path, path.join(__dirname, './src/lib/promise.js')).slice(3)
            if (pp.slice(0, 3) !== '../') {
                pp = './' + pp
            }
            return `const Promise = require('${pp}');` + contents
        }))
        .pipe(babel({
            presets: [ 'es2015' ],
        }))
        //.pipe(uglify())
        .pipe(gulp.dest('weapp'))
})
