const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/dexie.mongoify.js',
    output: {
        path: './dist',
        filename: 'dexie.mongoify.min.js',
        libraryTarget: 'umd'
    },
    externals: {
        'dexie': 'Dexie'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            output: {
                comments: false
            }
        })
    ]
};
