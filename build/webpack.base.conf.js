var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var config = require('./config');

module.exports = {
    entry: {
        vendor: ['babel-polyfill'],
        main: path.resolve('src', 'main.js'),
        analysisMain: path.resolve('src', 'analysisMain.js')
    },
    output: {
        path: path.resolve('extension_bundle'),
        filename: '[name]Bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: require.resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: 'jQuery'

                }, {
                    loader: 'expose-loader',
                    options: '$'
                }]
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader']
                })
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        scss: ExtractTextPlugin.extract({
                            use: ['css-loader', 'sass-loader']
                        })
                    }
                }
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                use: 'file-loader?name=fonts/[name].[ext]'
            },
            {
                test: /\.(jpe?g|png|gif|svg|ico)$/,
                use: 'file-loader?name=imgs/[name].[ext]'
            },
            {
                test: /manifest\.json$/,
                use: 'file-loader?name=[name].[ext]'
            },
            {
                test: /icon\.png$/,
                use: 'file-loader?name=[name].[ext]'
            },
        ]
    },
    resolve: {
        alias: {
            'vue$': path.join('vue', 'dist', 'vue.runtime.common.js')
        }
    },
    plugins: [
        // Make jQuery available globally
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        // Extract css into separate file
        new ExtractTextPlugin({
            filename: 'app.css',
            allChunks: true,
        }),
        // Build html file, inject output files
        new HtmlWebpackPlugin({
            filename: 'app.html',
            template: 'app.html',
            excludeChunks: ['analysisMain'],
            inject: true
        }),

        new HtmlWebpackPlugin({
            filename: 'analysis.html',
            template: 'analysis.html',
            excludeChunks: ['main'],
            inhect: true
        }),
        //Sets variables based on config file
        new webpack.DefinePlugin({
            APP_NAME: config.APP_NAME,
            APP_ID: config.APP_ID,
            APP_VERSION: config.APP_VERSION,
            APP_INSTALLER_ID: config.APP_INSTALLER_ID,
            CAMPAIGN: config.CAMPAIGN,
            COOKIE_DOMAIN: config.COOKIE_DOMAIN,
            GA_PRODUCT_CODE: config.GA_PRODUCT_CODE,
            DEV: config.DEV,
        })
    ]
};

