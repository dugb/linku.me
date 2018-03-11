var gulp          = require('gulp'),
    watch         = require('gulp-watch'),
    browserSync   = require('browser-sync').create();


gulp.task('watch', function(){

  browserSync.init({
    notify:false,
    proxy: "localhost:3000"
  });

  watch('./public/stylesheets/**/*.css', function(){
    gulp.start('cssInject');
  });

  watch('./public/scripts/**/*.js', function(){
    gulp.start('scriptsRefresh');
  })

  watch('./views/**/*.ejs', function(){
    browserSync.reload();
  });

});

  gulp.task('cssInject', ['styles'], function(){
    return gulp.src('./public/temp/styles/styles.css')
      .pipe(browserSync.stream());
  });

  gulp.task('scriptsRefresh', ['scripts'], function(){
    browserSync.reload();
  });
