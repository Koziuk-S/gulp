// NODE modules
const gulp = require('gulp'),
  del = require('del'),
  htmlBeautify = require('gulp-html-beautify');

// My modules
const importer = require('./importer'),
  templates = require('./templates-ads');

const paths = {
  src: __dirname + '/src/',
  dist: __dirname + '/build/'
};

// gulp task CLEAN
gulp.task('clean', function () {
  return del(paths.dist + '**', { force: true });
});

// gulp task MARCUP (compile html)
gulp.task('markup', function () {
  return gulp.src(paths.src + 'emails/*.html')
    .pipe(importer({
      src: paths.src,
      templates: templates
    }))
    .pipe(htmlBeautify({
      html: { indent_size: 2 }
    }))
    .pipe(gulp.dest(paths.dist));
});

// gulp task WATCH
gulp.task('watch', function () {
  gulp.watch(paths.src + '**/*.html', gulp.series('markup'));
})

// gulp task DEFAULT
gulp.task('default', gulp.series('clean', 'markup', 'watch'));

// gulp task BUILD
gulp.task('build', gulp.series('clean', 'markup'));