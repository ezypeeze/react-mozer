const webpack = require('webpack');
const path = require('path');

module.exports = {

    entry: path.resolve(__dirname, 'src', 'index.js'),

    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'build'),
        library: 'ReactMozer',
        libraryTarget: 'umd'
    },

    externals: [
        {
            react: {
                root: 'React',
                commonjs2: 'react',
                commonjs: 'react',
                amd: 'react'
            }
        }
    ],

    module: {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
        ]
    },

    node: {
        Buffer: false
    },

    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ],

};
