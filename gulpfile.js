const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const cleanCSS = require('gulp-clean-css');
const uglify = require("gulp-terser");
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();

gulp.task('server', function () {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    });
    gulp.watch("src/*.html").on('change', browserSync.reload);
});

gulp.task('html', () => {
    return gulp.src('src/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('dist'));
});


gulp.task('styles', function () {
    return gulp.src("src/assets/**/*.+(css)")
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(autoprefixer())
        .pipe(rename({
            suffix: '.min',
            prefix: ''
        }))
        .pipe(gulp.dest('dist/assets'))
        .pipe(browserSync.stream())
});


gulp.task('scripts', function() {
    return gulp.src ('src/assets/js/*.js') 
            .pipe (concat ('main.min.js')) 
            .pipe(uglify())
            .pipe (gulp.dest ('dist/assets/js')) 
            .pipe(browserSync.stream())
});


gulp.task('watch', function () {
    gulp.watch("src/assets/**/*.+(css)", gulp.parallel('styles'));
    gulp.watch("src/*.html").on('change', gulp.parallel('html'));
    gulp.watch("src/assets/js/**/*.js").on('change', gulp.parallel('scripts'));
});




exports.default = gulp.parallel('watch','server','html', 'styles','scripts');