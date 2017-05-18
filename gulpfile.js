var gulp = require('gulp');
var exec = require('child_process').exec;

gulp.task('default', () => {

});

var lasergameWatcher = gulp.watch('websrc/lasergame-ts/src/**/*.ts', () => {
  exec('')
});