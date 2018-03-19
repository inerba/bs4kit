"use strict";

var gulp = require("gulp"),
  concat = require("gulp-concat"),
  uglify = require("gulp-uglify"),
  rename = require("gulp-rename"),
  sass = require("gulp-sass"),
  maps = require("gulp-sourcemaps"),
  del = require("del"),
  autoprefixer = require("gulp-autoprefixer"),
  browserSync = require("browser-sync").create(),
  htmlreplace = require("gulp-html-replace"),
  cssmin = require("gulp-cssmin");

var path = {
  build: {
    js: "assets/js/",
    css: "assets/css/",
    images: "assets/images/",
    fonts: "assets/fonts/"
  },
  src: {
    js: "src/js",
    scss: "src/scss/main.scss",
    images: "src/images/**/*.*",
    fonts: "src/fonts/**/*.*"
  },
  watch: {
    js: "src/js/**/*.js",
    scss: "src/scss/**/*.scss",
    images: "src/images/**/*.*",
    fonts: "src/fonts/**/*.*"
  },
  clean: "./assets"
};

function exceptionLog(error) {
  console.log(error.toString());
  this.emit("end");
}
// 
gulp.task("baseJs", function() {
  return gulp
    .src([
      "node_modules/jquery/dist/jquery.js",
      //"node_modules/popper.js/dist/popper.js",
      "node_modules/bootstrap/dist/js/bootstrap.bundle.js"
    ])
    .pipe(concat("main.js"))
    .pipe(gulp.dest(path.src.js))
    .pipe(browserSync.stream());
});

gulp.task("pluginsJs", function() {
  return gulp
    .src([
      "node_modules/gsap/TweenMax.js",
      "node_modules/scrollmagic/scrollmagic/uncompressed/ScrollMagic.js",
      "node_modules/scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js",
      "node_modules/scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js"
    ])
    .pipe(concat("plugins.js"))
    .pipe(gulp.dest("src/js"))
    .pipe(browserSync.stream());
});

gulp.task("baseScss", function() {
  return gulp
    .src("src/scss/main.scss")
    .pipe(maps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(maps.write("./"))
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.stream())
    .on("error", exceptionLog);
});

gulp.task("minifyScripts", ["baseJs", "pluginsJs"], function() {
  return gulp
    .src(["src/js/main.js", "src/js/plugins.js"])
    .pipe(concat("all.js"))
    .pipe(gulp.dest("src/js"))
    .pipe(uglify())
    .pipe(rename("main.min.js"))
    .pipe(gulp.dest("assets/js"));
});

gulp.task("minifyCss", ["baseScss"], function() {
  gulp
    .src("src/main.css")
    .pipe(cssmin())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("assets/css"));
});

gulp.task("watch", function() {
  gulp.watch("src/scss/**/*.scss", ["baseScss"]);
  gulp.watch("src/js/**/*.js", ["baseJs"]);
});

gulp.task("clean", function() {
  del(["src/js", "src/css", "assets/js"]);
});

// sviluppo
gulp.task(
  "serve",["watch", "baseJs", "baseScss"], 
  function() {
    browserSync.init({
      proxy: "http://cimm.test",
      open: "external"
    });

    gulp.watch("src/scss/**/*.scss", ["watch"]);
    gulp.watch("src/js/**/*.js", ["watch"]);
    gulp.watch(["**/*.html", "**/*.htm"]).on("change", browserSync.reload);
  }
);