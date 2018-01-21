const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const minifycss = require('gulp-cssnano');
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const del = require('del');

gulp.task('sass', function () {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
});

gulp.task('styles', ['sass'], function () {
  return gulp.src([
    './node_modules/bootstrap/dist/css/bootstrap.css',
    './app/css/styles.css'
  ])
    .pipe(concat('main.css'))
    .pipe(gulp.dest('app/css'))
});
// add subtask to build!!!
gulp.task('build_styles', function () {
  return gulp.src('./app/css/main.css') 
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('./dist/css'))
});

gulp.task('scripts', function () {
  return gulp.src([
    './node_modules/jquery/dist/jquery.js',
    './app/js/app.js'
  ])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./app/js'))
});

gulp.task('build_scripts', function () {
  return gulp.src('./app/js/main.js')
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
});

gulp.task('images', function () {
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function () {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
})

gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})

gulp.task('watch', ['browserSync', 'sass'], function () {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/../*.js', ['scripts']);
});

gulp.task('clean:dist', function () {
  return del.sync('dist');
})

//https://css-tricks.com/gulp-for-beginners/