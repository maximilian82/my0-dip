//local site name on virtual host
var localSite = "diplom"; //write a name of the site folder(openserver)

var     gulp         = require('gulp'),
		sass         = require('gulp-sass'),
		postcss      = require('gulp-postcss'),
		sourcemaps   = require('gulp-sourcemaps'),
		autoprefixer = require('autoprefixer'),
		notify       = require('gulp-notify');

var browserSync = require('browser-sync');
var reload      = browserSync.reload;

gulp.task('browser-sync', function() {
    //watch files
    var files = [
    'assets/css/*.css',
    'assets/js/*.js',
    './*.php',
    'templates/*.php',
    './*.html'
    ];
 
    //initialize browsersync
    browserSync.init(files, {
    //browsersync with a php server
    open: 'external',
    host: localSite,
    proxy: localSite,
    port: 3000,
    notify: false
    });
});


gulp.task('post-css', function () {

    var bourbon = require('node-bourbon').includePaths,
        normalize = require('node-normalize-scss').includePaths;
    var processors = [
        autoprefixer({browsers: ['last 2 version', 'safari 7', 'ie 10', 'ios 6', 'android 4']})        
    ];
    return gulp.src('sass/*.sass')        
        .pipe(sourcemaps.init()) // start sourcemaps
        .pipe(sass({
        	outputStyle: 'compressed',
        	includePaths: [].concat(normalize, bourbon)
        }).on("error", notify.onError({
        message: "<%= error.message %>",
        title: "Error Compiling"
    		})))
        //.pipe(sourcemaps.write()) // write map inline	
        .pipe(gulp.dest('assets/css'))
        //.pipe(sourcemaps.init({loadMaps: true})) // init sourcemaps again after  pipe to dest dir 
        .pipe(postcss(processors))
        .pipe(sourcemaps.write('./maps')) // write map to external dir instead of inline
        //.pipe(sourcemaps.write('../../'))
        .pipe(gulp.dest('assets/css'))
        .pipe(reload({stream:true}));        
});


gulp.task('watch', function() {
	
	gulp.watch('sass/*.sass', ['post-css']);

});

gulp.task('default', ['watch', 'browser-sync']);
//last modified 16.02.17