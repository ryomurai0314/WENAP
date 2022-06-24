"use strict";

const gulp = require("gulp");
const { src, dest, watch, series } = require("gulp");

const plumber = require("gulp-plumber");
const sassGlob = require("gulp-sass-glob-use-forward");
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync");

function compile(done) {
    src("./src/sass/**/*.scss")
      .pipe(plumber())                   // watch中にエラーが発生してもwatchが止まらないようにする
      .pipe(sassGlob())                  // glob機能を使って@useや@forwardを省略する
      .pipe(sass())                      // sassのコンパイルをする
      .pipe(autoprefixer())              // ベンダープレフィックスを自動付与する
      .pipe(dest("./src/css"));

    done();
}

const reloadFile = (done) => {
    browserSync.init({
        server : {
            baseDir : "./src",
            index : "index.html",
            directory: true,
        },
    });
    done();
};
// リロード設定
const reloadBrowser = (done) => {
    browserSync.reload();
    done();
};

const watchFiles = function() {
    watch('./src/sass/**/*.scss', compile);
    watch("./src/*.html", reloadBrowser);
    watch("./src/css/*.css", reloadBrowser);
}

exports.default = series(reloadFile,watchFiles);