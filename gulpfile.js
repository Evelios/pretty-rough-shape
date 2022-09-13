const {src, dest, watch, series, parallel} = require('gulp');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync');
const cache = require('gulp-cache');
// const concat = require('gulp-concat');
const cssnano = require('cssnano');
const imagemin = require('gulp-imagemin');
const postcss = require('gulp-postcss');
const prefix = require('gulp-autoprefixer');
// const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'))
const sourcemaps = require('gulp-sourcemaps');
// const uglify = require('gulp-uglify');

const cp = require("child_process");

const jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';

const files = {
    scss: 'assets/css/sass/main.sass',
    site: {
        css: '_site/assets/css',
        img: '_site/assets/img',
        fonts: '_site/assets/fonts'
    },
    all: {
        css: 'assets/css',
        scss: 'assets/css/sass/**/*.sass',
        fonts: 'assets/fonts/**/*',
        js: 'assets/js/**/*.js',
        images: 'assets/img/**/*',
        html: ['*.html', '_layouts/*.html', '_includes/*.html', '_pages/*.html', '_posts/*.markdown']
    }
};


// Adding extra debugging information to be displayed into the console
// (function () {
//     const childProcess = require("child_process");
//     const oldSpawn = childProcess.spawn;
//
//     function mySpawn() {
//         console.log('spawn called');
//         console.log(arguments);
//         return oldSpawn.apply(this, arguments);
//     }
//
//     childProcess.spawn = mySpawn;
// })();


// Compile files
function sassTask() {
    console.log("Sass Task");
    return src(files.scss)
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(
            sass.sync({
                outputStyle: 'expanded',  // nested, expanded, compact, compressed
                onError: browserSync.notify,
                sourceComments: false
            })
                .on('error', sass.logError)
        )
        .pipe(
            prefix(
                ['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
                {cascade: true}
            )
        )
        .pipe(postcss([
            autoprefixer(),
            cssnano()
        ]))
        .pipe(sourcemaps.write('.', {loadMaps: true})) // write sourcemaps file in current directory
        .pipe(dest(files.site.css))
        .pipe(browserSync.reload({stream: true}))
        .pipe(dest(files.all.css));
}


// Compression images
function imageTask() {
    console.log("Image Task");
    return src(files.all.images)
        .pipe(cache(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({progressive: true}),
            imagemin.optipng({svgoPlugins: [{removeViewBox: false}]}),
        ])))
        .pipe(dest(files.site.images))
        .pipe(browserSync.reload({stream: true}));
}


// Fonts
function fontsTask() {
    console.log("Fonts Task");
    return src(files.all.fonts)
        .pipe(dest(files.site.fonts))
        .pipe(browserSync.reload({stream: true}));
}


function cleanTask() {
    console.log("Clean Task");
    return cp.spawn('bundle', ['exec', jekyll, 'clean'], {stdio: 'inherit'});
}


function buildTask() {
    console.log("Build Task");
    return cp.spawn('bundle', ['exec', jekyll, 'build'], {stdio: 'inherit'})
        .on('close', browserSync.reload);
}


function watchTask() {
    series(buildTask)

    browserSync({
        server: {
            baseDir: '_site'
        },
        notify: false
    });

    watch(files.all.scss, sassTask);
    watch(files.all.fonts, fontsTask);
    watch(files.all.images, imageTask);
    watch(files.all.js, buildTask).on('close', browserSync.reload);
    watch(files.all.html, buildTask).on('close', browserSync.reload);
}


// ---- Gulp Actions ----

exports.watch = watchTask;
exports.build = buildTask;
exports.sass = sassTask;
exports.image = imageTask;
exports.fonts = fontsTask;
exports.clean = cleanTask;
exports.default = watchTask