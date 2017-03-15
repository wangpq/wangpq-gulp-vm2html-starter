// gulpfile.js
// Load plugins
var gulp = require('gulp')
  , $  = require('gulp-load-plugins')()
  , connect = require('gulp-connect-multi')()
  , less = require('gulp-less')
  , sass = require('gulp-sass')
  , LessAutoprefix = require('less-plugin-autoprefix')
  , autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });

//配置文件参数
var config = {
  "connect" : {
    "root" : ['./src/'],
    "port" : 8080,
    "lviereload" : true
  },
	'tpl':{
		"root":"src/tpl/",// 数据模板根目录 
    "data" : "data", // 测试数据根目录
    "exclude" : "./src/tpl/widget/*.vm",
    "macro": "./src/tpl/global-macro/macro.vm",//global macro defined file
    "output" : "./src/html"
	}
};

gulp.task('connect', connect.server({
	root: config.connect.root,
	port: config.connect.port,
	lviereload : config.connect.lviereload
}));

gulp.task('less', function () { 
  gulp.src('./src/less/*.less')
    .pipe(less({
      plugins: [autoprefix]
    }))
    .pipe(gulp.dest('./src/css'))
	  .pipe(connect.reload()); 
});

gulp.task('sass', function () { 
  gulp.src('./src/sass/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./src/css'))
      .pipe(connect.reload()); 
});

gulp.task('style', function () { 
  gulp.src('./src/css/*.css')
      .pipe(connect.reload()); 
  gulp.src('./src/html/*.html')
      .pipe(connect.reload());  
});

gulp.task('javascript', function () { 
  gulp.src('./src/js/')
      .pipe(connect.reload());   
});

gulp.task('tpl', function() {
  return gulp.src(config.tpl.root+'**/*.vm')
    .pipe($.vm2html({
      vmRootpath: config.tpl.root,
      mockRootpath: config.tpl.data,
      exclude: config.tpl.exclude,
      macro: config.tpl.macro
    }))
    .pipe(gulp.dest(config.tpl.output));
});

gulp.task('html', function() {
	gulp.src(config.tpl.output + '**/*.html')
		.pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch(['./src/sass/*.scss'], ['sass']);
  gulp.watch(['./src/less/*.less'], ['less']);
  gulp.watch(['./src/css/*.css'], ['style']);
  gulp.watch(['./src/tpl/*.vm'], ['tpl']);
  gulp.watch(['./src/html/*.html'], ['html']);
  gulp.watch(['./src/js/app/*.js'], ['javascript']);
});


gulp.task('default', ['connect','watch']);
