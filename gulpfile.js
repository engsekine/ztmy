const gulp = require('gulp') //gulp本体
const sass = require('gulp-dart-sass') //Dart Sass はSass公式が推奨 @use構文などが使える
const plumber = require('gulp-plumber') // エラーが発生しても強制終了させない
const notify = require('gulp-notify') // エラー発生時のアラート出力
const browserSync = require('browser-sync') //ブラウザリロード
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')

// 入出力するフォルダを指定
const srcBase = 'src'
const distBase = 'dist'

const srcPath = {
    html: srcBase + '/**/*.html',
    scss: 'scss/**/*.scss',
    js: 'js/**/*.js'
}

const distPath = {
    html: distBase + '/',
    css: distBase + '/css/',
    js: distBase + '/js/'
}

/*html*/
const html = () => {
    return gulp.src(srcPath.html).pipe(gulp.dest(distPath.html))
}
/*sass*/
const cssSass = () => {
    return gulp
        .src(srcPath.scss, {
            sourcemaps: true
        })
        .pipe(
            //エラーが出ても処理を止めない
            plumber({
                errorHandler: notify.onError('Error:<%= error.message %>')
            })
        )
        .pipe(sass({ outputStyle: 'expanded' })) //指定できるキー expanded compressed
        .pipe(gulp.dest(distPath.css, { sourcemaps: './' })) //コンパイル先
        .pipe(browserSync.stream())
        .pipe(
            notify({
                message: 'Sassをコンパイルしました！',
                onLast: true
            })
        )
}
/*js*/
const javascript = () => {
    return gulp
        .src('./src/js/**/*.js')
        .pipe(concat('project.js')) //project.jsに他のjsファイルをconcat
        .pipe(uglify()) //minify
        .pipe(
            rename({
                suffix: '.min'
            })
        )
        .pipe(gulp.dest('./dist/js'))
}

/**
 * ローカルサーバー立ち上げ
 */
const browserSyncFunc = () => {
    browserSync.init(browserSyncOption)
}

const browserSyncOption = {
    server: distBase
}

/**
 * リロード
 */
const browserSyncReload = (done) => {
    browserSync.reload()
    done()
}

/**
 *
 * ファイル監視 ファイルの変更を検知したら、browserSyncReloadでreloadメソッドを呼び出す
 * series 順番に実行
 * watch('監視するファイル',処理)
 */
const watchFiles = () => {
    gulp.watch(srcPath.html, gulp.series(html, browserSyncReload))
    gulp.watch(srcPath.scss, gulp.series(cssSass))
    gulp.watch(srcPath.js, gulp.series(javascript))
}

/**
 * seriesは「順番」に実行
 * parallelは並列で実行
 */
exports.default = gulp.series(gulp.parallel(html, cssSass, javascript), gulp.parallel(watchFiles, browserSyncFunc))
