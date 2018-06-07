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
    './app/css/styles.css'
  ],
  js: [ //include js libraries here
    './node_modules/jquery/dist/jquery.js',
    './node_modules/bootstrap/dist/js/bootstrap.js',
    './app/js/app.js'
  ]
};

/////// Style tasks

gulp.task('sass', function () {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('styles', ['sass'], function () {
  return gulp.src(paths.css)
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./serve/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('build_styles', ['styles'], function () {
  return gulp.src('./serve/css/main.css') 
    .pipe(minifycss())
    .pipe(gulp.dest('./dist/css'))
});
/////////

////Scripts tasks

gulp.task('scripts', function () {
  return gulp.src(paths.js)
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./serve/js'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('build_scripts', ['scripts'], function () {
  return gulp.src('./serve/js/main.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
});
///////////

// gulp.task('html', function () {
//   return gulp.src('app/**/*.html')
//     .pipe(gulp.dest('./dist'));
// });

gulp.task('build_images', function () {
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('./dist/images'))
});

gulp.task('images', function () {
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(gulp.dest('./serve/images'))
});

gulp.task('fonts', function () {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('./serve/fonts'))
})

gulp.task('pug', function buildHTML() {
  return gulp.src('app/templates/pages/**/*.pug')
  .pipe(pug({
    locals: {},
    pretty: true
  }))
  .pipe(gulp.dest('serve'))
  .pipe(browserSync.reload({
    stream: true
  }))
});

gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: 'serve'
    },
  })
})

gulp.task('clean:dist', function () {
  return del.sync('dist');
})

gulp.task('clean:serve', function () {
  return del.sync('dist');
})

gulp.task('preWatch', )

gulp.task('watch', ['clean:serve', 'browserSync', 'fonts', 'images', 'styles', 'scripts', 'pug'], function (callback) {
  gulp.watch('app/scss/**/*.scss', ['styles']);
  gulp.watch('app/img/**/*.+(png|jpg|jpeg|gif|svg)', ['images']);
  gulp.watch('app/js/*.js', ['scripts']);
  gulp.watch('app/templates/**/*.pug', ['pug']);
  gulp.watch('app/html/**/*.html', browserSync.reload);
});

gulp.task('build', function (callback) {
  runSequence('clean:dist', 
    ['build_scripts', 'build_styles', 'html', 'images', 'fonts'], 
    callback)
})