const webpack = require('webpack');

module.exports = {

    devtool: 'inline-source-map',

    entry: __dirname + '/index.js',

    output: {
        filename: 'bundle.js',
        chunkFilename: '[id].chunk.js',
        publicPath: '/'
    },

    module: {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
        ]
    },

    resolve: {
        alias: {
            'react-mozer': './index'
        }
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        })
    ]

};