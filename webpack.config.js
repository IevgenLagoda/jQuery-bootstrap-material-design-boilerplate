var path = require('path'),
    fs = require('fs'),
    webpack = require("webpack"),
    libPath = path.join(__dirname, 'lib'),
    wwwPath = path.join(__dirname, 'www'),
    pkg = require('./package.json'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: path.join(libPath, 'index.js'),
    entry: {
        vendor: path.join(libPath, 'index.js'),
        comment: path.join(libPath, 'js', 'comment.js')
    },
    output: {
        path: path.join(wwwPath, 'js'),
        filename: 'bundle-[hash:6].js'
    },
    module: {
        loaders: [{
            test: /\.html$/,
            loader: 'html'
        }, {
            test: /\.md$/,
            loader: "html!markdown"
        }, {
            test: /\.json$/,
            loader: "file?name=data/[name].[ext]"
        }, {
            test: /\.(png|jpg)$/,
            loader: 'file?name=img/[name].[ext]' // inline base64 URLs for <=10kb images, direct URLs for the rest
        }, {
            test: /\.css$/,
            loader: "style!css"
        }, {
            test: /\.scss$/,
            loader: "style!css!autoprefixer!sass"
        }, {
            test: /\.js$/,
            loader: "babel"
        }, {
            test: [/fontawesome-webfont\.svg/, /fontawesome-webfont\.eot/, /fontawesome-webfont\.ttf/, /fontawesome-webfont\.woff/],
            loader: 'file?name=fonts/[name].[ext]'
        }]
    },
    resolve: {
        extensions: ['', '.js', '.json', '.scss', '.html']
    },
    externals: {
        "jquery": "jQuery"
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor-[hash:6].js"),
        new webpack.optimize.CommonsChunkPlugin("comment", "comment-[hash:6].js"),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            pkg: pkg,
            template: path.join(libPath, 'index.html')
        })
    ]
};
