const gulp = require('gulp'),
    importer = require('./importer'),
    templates = require('./templates-ads'),
    del = require('del');

const paths = {
    src: __dirname + '/src/',
    dist: __dirname + '/build/'
};

gulp.task('clean', function () {
    return del(paths.dist + '**', { force: true });
});

gulp.task('markup', function () {
    return gulp.src(paths.src + 'emails/*.html')
        .pipe(importer({
            src: paths.src,
            templates: templates
        }))
        .pipe(gulp.dest(paths.dist));
});

// watch
gulp.task('watch', function () {
    gulp.watch(paths.src + '**/*.html', gulp.series('markup'));
})

// // default
gulp.task('default', gulp.series('clean', 'markup', 'watch'));