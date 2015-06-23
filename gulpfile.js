var gulp = require('gulp'),
    path = require('path'),
    header = require('gulp-header'),
    webpack = require('webpack'),
    gulpWebpack = require('gulp-webpack'),
    extend = require('util')._extend,
    pkg = require('./package.json'),
    runSequence = require('run-sequence'),
    sitemap = require('gulp-sitemap'),
    del = require('del'),
    vinylPaths = require('vinyl-paths'),
    w3cjs = require('gulp-w3cjs'),
    webpackBuildConfig = require("./webpack.config.js"),
    libPath = path.join(__dirname, 'lib'),
    wwwPath = path.join(__dirname, 'www');

gulp.task('default', ['build']);
gulp.task('build:prod', function(callback) {
    runSequence('_build:clean', '_build:prod', callback);
});

gulp.task('build', function(callback) {
    runSequence('_build:clean', '_build:dev', callback);
});
gulp.task('_build:clean', function(cb) {
    return gulp.src(path.join(wwwPath, '*'), {
            read: false
        })
        .pipe(vinylPaths(del));
});

gulp.task("_build:dev", function(callback) {
    var webpackConfig = extend({}, webpackBuildConfig);
    return gulp.src(webpackConfig.entry.vendor)
        .pipe(gulpWebpack(webpackConfig))
        .pipe(gulp.dest(wwwPath));
});

gulp.task("_build:prod", function(callback) {
    var webpackConfig = extend({}, webpackBuildConfig);
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
        'nc': true,
        output: {
            comments: false
        }
    }));
    return gulp.src(webpackConfig.entry.vendor)
        .pipe(gulpWebpack(webpackConfig))
        .pipe(gulp.dest(wwwPath));
});
