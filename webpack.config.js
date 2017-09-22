const path = require('path');
const webpack = require('webpack');
const LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = {
    devtool: 'source-map',
    entry: ['./src/app'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js'
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loaders: ['ts-loader']
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loaders: [
                    'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'postcss-loader'
                ]
            }
        ]
    },
    plugins: [
        new LiveReloadPlugin()
    ]
};