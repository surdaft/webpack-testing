const path = require('path');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env, argv) => {
    const config = {
        entry: [
            '@babel/polyfill', // polyfill all the things for me! 🎉
            path.resolve('resources/js/app.js'),
            path.resolve('resources/scss/app.scss')
        ],
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react'
                        ]
                    },
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "sass-loader"
                    ]
                }
            ]
        },
        output: {
            filename: 'js/bundle.js',
            path: path.resolve(__dirname, 'public/assets')
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "css/bundle.css"
            })
        ],
        optimization: {} // required for below
    };

    switch (argv.mode) {
        case 'development':
            config.watch = true;

            config.watchOptions = {
                ignored: /node_modules/
            };

            config.stats = {
                warnings: false,
                errors: true
            };

            config.optimization.minimizer = [
                new UglifyJSPlugin({
                    test: /\.js(\?.*)?$/i,
                    exclude: /node_modules/,
                    sourceMap: true,
                    uglifyOptions: {
                        mangle: false,
                        keep_classnames: true,
                        keep_fnames: true
                    }
                })
            ];

            break;
        case 'production':
            config.optimization.minimizer = [
                new UglifyJSPlugin({
                    test: /\.js(\?.*)?$/i,
                    exclude: /node_modules/,
                    sourceMap: false
                }),
                new OptimizeCssAssetsPlugin()
            ];

            config.stats = {
                warnings: false,
                errors: false
            };

            break;
    }

    return config;
}