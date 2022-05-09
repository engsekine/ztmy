const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // モード値を production に設定すると最適化された状態で、development に設定するとソースマップ有効でJSファイルが出力される
    mode: "development",
    // メインとなるJavaScriptファイル（エントリーポイント）
    //entry: './src/index.tsx',
    entry: [
        './src/js/index.js',
    ],
    // ファイルの出力設定
    output: {
        // 出力ファイルのディレクトリ名
        path: path.join(__dirname, 'dist'),
        // 出力ファイル名
        filename: '[name].js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'html', 'index.html'), // パスの指定
            filename: 'html/index.html' // dist/html/以下にindex.htmlをビルド
        }),
        /*new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'html', 'header.html'),
            filename: 'html/header.html'
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'html', 'footer.html'),
            filename: 'html/footer.html'
        }),*/
    ],
    module: {
        rules: [
            // Sassファイルの読み込みとコンパイル
            {
                test: /\.scss/, // 対象となるファイルの拡張子
                use: [{
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'sass-loader',
                    },
                ],
            },
            // imgファイルの読み込みとコンパイル
            {
                // 対象となるファイルの拡張子
                test: /\.(gif|png|jpg|svg)$/,
                // 画像をBase64として取り込む
                type: "asset/inline",
            },
            // HTMLファイルの読み込みとコンパイル
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
        ],
    },
    // 実行時にブラウザが自動的に localhost を開く
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist', 'html'),
        },
        open: true,
        port: 1110,
    },
    // React TypeScript環境必須設定
    target: ["web", "es5"],
    // キャッシュ有効
    cache: false,
};