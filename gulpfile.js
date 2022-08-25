const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'))
const prefix = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const cache = require('gulp-cache');
const cp = require('child_process');
const browserSync = require('browser-sync');

const jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';

// Compile files
gulp.task('sass', function () {
    return gulp.src('assets/css/sass/main.sass')
        .pipe(sass.sync({
                outputStyle: 'compact',  // nested, expanded, compact, compressed
                onError: browserSync.notify,
                sourceComments: false
            }).on('error', sass.logError)
        )
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(gulp.dest('_site/assets/css'))
        .pipe(browserSync.reload({stream: true}))
        .pipe(gulp.dest('assets/css'));
});

// Compression images
gulp.task('img', function () {
    return gulp.src('assets/img/**/*')
        .pipe(cache(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({progressive: true}),
            imagemin.optipng({svgoPlugins: [{removeViewBox: false}]}),
        ])))
        .pipe(gulp.dest('_site/assets/img'))
        .pipe(browserSync.reload({stream: true}));
});

// Fonts
gulp.task('fonts', function () {
    return gulp.src('assets/fonts/**/*')
        .pipe(gulp.dest('_site/assets/fonts'))
        .pipe(browserSync.reload({stream: true}));
});

// Watch scss, html, img files
gulp.task('watch', function () {
    gulp.watch('assets/css/sass/*.*', ['sass']);
    gulp.watch('assets/js/**/*.js', ['jekyll-rebuild']);
    gulp.watch('assets/img/**/*', ['img']);
    gulp.watch('assets/fonts/**/*', ['fonts']);
    gulp.watch(['*.html', '_layouts/*.html', '_includes/*.html', '_pages/*.html', '_posts/*'], ['jekyll-rebuild']);
});

// Build the Jekyll Site
gulp.task('jekyll-build', function (done) {
    return cp.spawn(jekyll, ['build'], {stdio: 'inherit'})
        .on('close', done);
});

// Rebuild Jekyll and page reload
gulp.task('jekyll-rebuild', gulp.series('jekyll-build', function () {
    browserSync.reload();
}));

// Wait for jekyll-build, then launch the Server
gulp.task('browser-sync', gulp.series(['sass', 'img', 'fonts', 'jekyll-build'], function () {
    browserSync({
        server: {
            baseDir: '_site'
        },
        notify: false
    });
}));


//  Default task
gulp.task('default', gulp.series(['browser-sync', 'watch'], function () {
}));
