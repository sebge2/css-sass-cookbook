const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const del = require('del');
const merge = require("merge-stream");

gulp.task('clean', () => {
    return del([
        'css/main.css',
    ]);
});

gulp.task('styles', () => {
    return gulp.src('scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./build/css/'));
});

gulp.task('copy-resources', function() {
  return merge([
      gulp.src('./*.html').pipe(gulp.dest('./build/')),
  ]);
});

gulp.task('watch', () => {
    gulp.watch(['scss/**/*.scss', '*.html'], (done) => {
        gulp.series(['clean', 'styles', 'copy-resources'])(done);
    });
});

gulp.task('default', gulp.series(['clean', 'styles', 'copy-resources']));
