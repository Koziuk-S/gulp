'use strict';

const gulp = require('gulp'),

  del = require('del'),
  notify = require('gulp-notify'),
  rigger = require('gulp-rigger'),
  rename = require('gulp-rename'),
  sourcemaps = require('gulp-sourcemaps'),

  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),

  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  minifyCSS = require('gulp-minify-css'),

  babel = require('gulp-babel'),
  uglyfly = require('gulp-uglyfly'),

  connect = require('gulp-connect'),
  livereload = require('gulp-livereload');

const paths = {
  src: __dirname + '/src/',
  dist: __dirname + '/build/'
};

gulp.task('clean', function () {
  return del(paths.dist + '**', { force: true });
});

// server connect
gulp.task('connect', function () {
  connect.server({
    port: 5005,
    root: paths.dist,
    livereload: true
  });
});

// html
gulp.task('html', function () {
  gulp.src(paths.src + 'index.html')
    .pipe(rigger())
    .pipe(gulp.dest(paths.dist))
    .pipe(connect.reload())
    .pipe(notify({
      message: 'HTML task is done.',
      onLast: true
    }));
});

// styles
gulp.task('styles', function () {
  gulp.src(paths.src + 'styles/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(minifyCSS())
    .pipe(rename('app.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist))
    .pipe(connect.reload())
    .pipe(notify({
      message: 'Styles are compiled.',
      onLast: true
    }));
});

// js
gulp.task('js', function () {
  gulp.src(paths.src + 'js/*.js')
    .pipe(rigger())
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglyfly())
    .pipe(rename('app.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist))
    .pipe(connect.reload())
    .pipe(notify({
      message: 'JS is compiled.',
      onLast: true
    }));
});

// img
gulp.task('img', function () {
  gulp.src(paths.src + 'img/**/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest(paths.dist + 'img/'))
    .pipe(connect.reload())
    .pipe(notify({
      message: 'IMG task is done.',
      onLast: true
    }));
});

// watch
gulp.task('watch', function () {
  gulp.watch('src/**/*.html', ['html'])
  gulp.watch('src/**/*.scss', ['styles'])
  gulp.watch('src/**/*.js', ['js'])
  gulp.watch('src/img/**/*', ['img'])
});

// default
gulp.task('default', ['connect', 'html', 'styles', 'js', 'watch']);

// build
gulp.task('build', ['clean', 'html', 'styles', 'js', 'img']);
