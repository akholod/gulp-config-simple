const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const runSequence = require('run-sequence');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const minifycss = require('gulp-cssnano');
const pug = require('gulp-pug');
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const del = require('del');

const paths = {
  css: [ //include css libraries here
    './node_modules/bootstrap/dist/css/bootstrap.css',
  ],
  js: [ //include js libraries here
    './node_modules/jquery/dist/jquery.js',
    './node_modules/popper.js/dist/umd/popper.js',
    './node_modules/bootstrap/dist/js/bootstrap.js'
  ]
};

/////// Style tasks
gulp.task('sass', function () {
  return gulp.src('./app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('vendor:css', function () {
  return gulp.src(paths.css)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('styles', ['sass', 'vendor:css'], function () {
  return gulp.src('./app/css/**/*.css')
    .pipe(gulp.dest('./.serve/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('build_styles', ['styles'], function () {
  return gulp.src('./app/css/**/*.css') 
    .pipe(minifycss())
    .pipe(gulp.dest('./dist/css'))
});
/////////


////Scripts tasks
gulp.task('vendor:js', function () {
  return gulp.src(paths.js)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./app/js'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('scripts', ['vendor:js'],function () {
  return gulp.src('./app/js/**/*.js')
    .pipe(gulp.dest('./.serve/js'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('build_scripts', ['vendor:js'], function () {
  return gulp.src('app/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
});
///////////

////Scripts assets copy tasks
gulp.task('build_images', function () {
  return gulp.src('./app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('./dist/images'))
});

gulp.task('images', function () {
  return gulp.src('./app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(gulp.dest('./.serve/images'))
});

gulp.task('fonts', function () {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('./.serve/fonts'))
})
/////

///Templates compile tasks
gulp.task('views', function buildHTML() {
  return gulp.src('./app/templates/pages/**/*.pug')
  .pipe(pug({
    locals: {},
    pretty: true
  }))
  .pipe(gulp.dest('./.serve'))
  .pipe(browserSync.reload({
    stream: true
  }))
});

gulp.task('build_views', function buildHTML() {
  return gulp.src('./app/templates/pages/**/*.pug')
  .pipe(pug({
    locals: {},
  }))
  .pipe(gulp.dest('./dist'))
  .pipe(browserSync.reload({
    stream: true
  }))
});
/////

//clean tasks
gulp.task('clean:dist', function () {
  return del.sync('./dist');
})

gulp.task('clean:serve', function () {
  return del.sync('./.serve');
})
/////////

gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: './.serve'
    },
  })
})

gulp.task('preWatch', function (callback) {
  runSequence('clean:serve', 
    ['browserSync', 'fonts', 'images', 'styles', 'scripts', 'views'], 
    callback)
})

gulp.task('watch', ['preWatch'], function () {
  gulp.watch('app/scss/**/*.scss', ['styles']);
  gulp.watch('app/img/**/*.+(png|jpg|jpeg|gif|svg)', ['images']);
  gulp.watch('app/js/*.js', ['scripts']);
  gulp.watch('app/templates/**/*.pug', ['views']);
  gulp.watch('app/html/**/*.html', browserSync.reload);
});

gulp.task('build', function (callback) {
  runSequence('clean:dist', 
    ['build_scripts', 'build_styles', 'build_views', 'images', 'fonts'], 
    callback)
})