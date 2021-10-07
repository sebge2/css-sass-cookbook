const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const del = require('del');
const merge = require("merge-stream");

gulp.task('clean', () => {
    return del([
        './build/',
    ]);
});

gulp.task('styles', () => {
    return gulp.src('scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./build/css/'));
});

gulp.task('copy-resources', function() {
  return merge([
      gulp.src('./html/*.html').pipe(gulp.dest('./build/')),
      gulp.src('./assets/**/*').pipe(gulp.dest('./build/assets/')),
  ]);
});

gulp.task('watch', () => {
    reload = function (done) {
        gulp.series(['clean', 'styles', 'copy-resources'])(done);
    }

    gulp.watch('scss/**/*.scss', reload);
    gulp.watch('html/**/*.html', reload);
    gulp.watch('assets/**/*', reload);
});

gulp.task('default', gulp.series(['clean', 'styles', 'copy-resources']));
