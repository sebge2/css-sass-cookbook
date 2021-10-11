const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const del = require('del');
const merge = require("merge-stream");
const fs = require("fs");
const xpath = require("xpath-html");

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

gulp.task('generate-index', function() {
    function formatter(filePath) {
        const htmlContent = fs.readFileSync(`./html/${filePath}`, 'utf8');
        const title = xpath.fromPageSource(htmlContent).findElement("//title");

        return `<li><a href="${filePath}">${title.getText()}</a>\n`;
    }

    return merge([gulp
        .src(['./html/*.html'])
        .pipe(require('gulp-filelist')('index.html', { destRowTemplate: formatter, relative: true}))
        .pipe(require('gulp-modify-file')((content) => {
           return `
           <!DOCTYPE html>
           <html>
           <head>
               <title>CSS & SASS Cookbook</title>
           </head>
           <body>
               <p>Available Pages:</p>
               <ul id="page_list">
                    ${content}
               </ul>
           </body>
           </html>
           `;
         }))
      .pipe(gulp.dest('build'))
    ]);
});

gulp.task('watch', () => {
    reload = function (done) {
        gulp.series(['clean', 'styles', 'copy-resources', 'generate-index'])(done);
    }

    gulp.watch('scss/**/*.scss', reload);
    gulp.watch('html/**/*.html', reload);
    gulp.watch('assets/**/*', reload);
});

gulp.task('default', gulp.series(['clean', 'styles', 'copy-resources', 'generate-index']));
