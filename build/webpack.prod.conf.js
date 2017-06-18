
var path = require('path');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');
var ZipPlugin = require('zip-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(baseWebpackConfig, {
    plugins: [
        // Zip output directory
        new ZipPlugin({
            path: '..',
            filename: 'webui.zip'
        }),
        // Delete output directory
        new CleanWebpackPlugin(['extension_bundle'], {
            root: path.resolve(__dirname, '..'),
            verbose: true,
            dry: false
        })
    ]
});
