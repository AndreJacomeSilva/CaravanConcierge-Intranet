const gulp = require('gulp');
const eslint = require('gulp-eslint');
const exec = require('child_process').exec;

const { src, dest, symlink, series } = require('gulp');

gulp.task('eslint', () => {
  return gulp.src('./Fleet/*.js')
    .pipe(eslint({ fix: true }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
});

function rentsDependencies() {
  return src('./Fleet/Fleet.public.js')
    .pipe(symlink('./Rents/', { "overwrite": false }));
}

function fleetDependencies() {
  return src('./Utils/BaseEntity.js')
    .pipe(src('./Utils/Entities.js'))
    .pipe(src('./Utils/Utils.js'))
    .pipe(symlink('./Fleet/', { "overwrite": true }));
}

function pushRents() {

  return exec('cd ./Rents && clasp push');
}

function pushFleet() {
  gulp.src('./Fleet/*.js')
    .pipe(eslint({ fix: true }))
    .pipe(eslint.format());

  return exec('cd ./Fleet && clasp push');
}

function pushOwners() {
  return exec('cd ./Fleet && clasp push');
}

exports.pushRents = pushRents;
exports.pushFleet = pushFleet;
exports.pushOwners = pushOwners;

exports.pushAll = series(pushRents, pushFleet);

exports.createDependencies = series(fleetDependencies); // Add here the rest of the dependencies