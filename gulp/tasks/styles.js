var gulp          = require('gulp'),
nested        = require('postcss-nested'),
cssvars       = require('postcss-simple-vars'),
postcss       = require('gulp-postcss'),
autoprefixer  = require('autoprefixer'),
mixins        = require('postcss-mixins'),
cssImport     = require('postcss-import'),
hexrgba       = require('postcss-hexrgba');

gulp.task('styles', function(){
  return gulp.src('./public/stylesheets/styles.css')
    .pipe(postcss([cssImport, mixins, cssvars, nested, hexrgba, autoprefixer]))
    .on('error', function(err){
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(gulp.dest('./public/temp/styles'));
});
