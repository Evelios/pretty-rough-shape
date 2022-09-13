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
// const sourcemaps = require('gulp-sourcemaps');
// const uglify = require('gulp-uglify');

const cp = require("child_process");

const jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';

const files = {
    scss: 'assets/css/sass/**/*.sass',
    fonts: 'assets/fonts/**/*',
    js: 'assets/js/**/*.js',
    images: 'assets/img/**/*',
    html: ['*.html', '_layouts/*.html', '_includes/*.html', '_pages/*.html', '_posts/*.markdown']
};


// Adding extra debugging information to be displayed into the console
(function () {
    const childProcess = require("child_process");
    const oldSpawn = childProcess.spawn;

    function mySpawn() {
        console.log('spawn called');
        console.log(arguments);
        return oldSpawn.apply(this, arguments);
    }

    childProcess.spawn = mySpawn;
})();

// Sass task: compiles the style.scss file into style.css
// function scssTask(){
//     return src(files.scssPath)
//         .pipe(sourcemaps.init()) // initialize sourcemaps first
//         .pipe(sass().on('error', sass.logError))
//         .pipe(postcss([ autoprefixer(),cssnano() ]))
//         .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
//         .pipe(dest('_site/assets/css/')) // put final CSS in dist folder
//         .pipe(browserSync.reload({stream:true}))
// }

// Compile files
function sassTask() {
    console.log("Sass Task");
    return src('assets/css/sass/main.sass')
        .pipe(sass.sync({
                outputStyle: 'expanded',  // nested, expanded, compact, compressed
                onError: browserSync.notify,
                sourceComments: false
            }).on('error', sass.logError)
        )
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(postcss([
            autoprefixer(),
            cssnano()
        ]))
        .pipe(dest('_site/assets/css'))
        .pipe(browserSync.reload({stream: true}))
        .pipe(dest('assets/css'));
}


// Compression images
function imageTask() {
    console.log("Image Task");
    return src('assets/img/**/*')
        .pipe(cache(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({progressive: true}),
            imagemin.optipng({svgoPlugins: [{removeViewBox: false}]}),
        ])))
        .pipe(dest('_site/assets/img'))
        .pipe(browserSync.reload({stream: true}));
}


// Fonts
function fontsTask() {
    console.log("Fonts Task");
    return src('assets/fonts/**/*')
        .pipe(dest('_site/assets/fonts'))
        .pipe(browserSync.reload({stream: true}));
}


function cleanTask() {
    console.log("Clean Task");
    return cp.spawn('bundle', ['exec', jekyll, 'clean'], {stdio: 'inherit'});
}

function buildTask(cb) {
    console.log("Build Task");
    return cp.spawn('bundle', ['exec', jekyll, 'build'], {stdio: 'inherit'})
        .on('close', cb);
}


function rebuildTask() {
    console.log("Rebuild Task");
    const rc = series(buildTask);
    browserSync.reload();
    return rc;
}


// Wait for jekyll-build, then launch the Server
function browserTask() {
    console.log("Browser Task");
    const rc = series(sassTask, imageTask, fontsTask, buildTask);
    browserSync({
        server: {
            baseDir: '_site'
        },
        notify: false
    });
    return rc;
}


// Watch scss, html, img files
function watchTask() {
    watch(files.scss, sassTask);
    watch(files.fonts, fontsTask);
    watch(files.js, rebuildTask);
    watch(files.images, imageTask);
    watch(files.html, rebuildTask);
}


// ---- Gulp File Actions ----

exports.build = buildTask;
exports.watch = series(buildTask, watchTask);
exports.sass = sassTask;
exports.image = imageTask;
exports.fonts = fontsTask;
exports.clean = cleanTask;
exports.default = series(buildTask, parallel(browserTask, watchTask));