var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: path.resolve('test', 'utils_tests.js'),
    output: {
        path: path.resolve('test'),
        filename: '[name]-es5.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
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
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': path.join('vue', 'dist', 'vue.common.js')
        }
    },
    plugins: [
        // Make jQuery available globally
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ]
};

