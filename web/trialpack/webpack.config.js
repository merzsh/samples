/**
 * TrialPack is web application contains several basic samples to ease web development experience.
 * Copyright (c) 2024 Andrey Miroshnichenko <merzsh@gmail.com, https://github.com/merzsh>
 *
 * This file is part of TrialPack.
 *
 * TrialPack is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

//const autoprefixer = require('autoprefixer');
//const HotModuleReplacementPlugin = require('webpack-hot-middleware');
//const webpack = require('webpack');

/* Has deprecated not supported dependencies: inflight@1.0.6, rimraf@2.7.1/3.0.2, glob@7.2.3 - note this when use
  usage: 1) uncomment 'new CleanWebpackPlugin()' in this file, 2) add '"clean-webpack-plugin": "^4.0.0",' to package.json file */
// const {CleanWebpackPlugin} = require('clean-webpack-plugin');

let mode = "production";
//let mode = "development";

const cssRule = (isMiniCSSExtractPlugin, isModules) => {
  return [
    { loader: isMiniCSSExtractPlugin ? MiniCSSExtractPlugin.loader : 'style-loader' },
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
        esModule: true,
        modules: isModules ? { namedExport: true, localIdentName: '[hash:base64:5]' } : undefined,
      }
    },
    {
      loader: 'sass-loader',
      options: { sourceMap: true },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
        // execute: true, // use if parser 'postcss-js' is enabled (see to style file as JSON file :)
        postcssOptions: {
          // config: 'postcss.config.js',
          // parser: 'postcss-js', // https://github.com/webpack-contrib/postcss-loader/issues/268
          plugins: [["autoprefixer" /* auto adds prefixes of common browsers (-moz, -webkit, -ms) for cross browsing better support */, {} ]]
        }
      },
    },
  ];
};

module.exports = {
    mode,

    // disable warnings about file size limit exceeded
    performance: {
      hints: false
    },

    // output line number like in source files (for debugging)
    devtool: 'source-map',

    resolve: {
      modules: [path.resolve(__dirname, "node_modules")],
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },

    // Entry point with sources files
    entry: {
        main: path.resolve(__dirname, "./src/index"),
    },

    // export bundle point
    output: {
        path: path.resolve(__dirname, "./dest"),
        filename: "bundle.js",
        clean: true,
    },

    devServer: {    // yarn add -D webpack-dev-server
        allowedHosts: 'all',
        historyApiFallback: true,
        static: { directory: path.join(__dirname, "./dest") }, // dir with index.html file
        open: true,
        compress: true,
        hot: true,
        port: 8888,
    },

    plugins: [
        // create final bundle index.html based on template html with embedded jsx/tsc component
        new HtmlWebpackPlugin({
          title: "Trial pack by Merzsh",
          //template: path.resolve(__dirname, "./src/index.ejs"), // template for output index.html
          template: path.resolve(__dirname, "./index.ejs"),
          filename: "index.html", // name of output file
        }),

        // apply changes on fly
        // yarn add -D webpack-hot-middleware
        //new HotModuleReplacementPlugin(),

        // build directory cleaning
        // new CleanWebpackPlugin()

        new MiniCSSExtractPlugin({
          filename: 'css/[name].[contenthash:6].css',
        })
    ],

    module: {
        rules: [
            {   // loader for *.html files
                test: /\.(html)$/, use: ['html-loader']
            },
            {
              test: /.(s?css|sass)$/,
              exclude: /\.modules\.(s?css|sass)$/,
              use: cssRule(true, false),
            },
            {
              test: /\.modules\.(s?css|sass)$/,
              use: cssRule(true, true),
            },
            {
                // loader for Babel compiler
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                //use: ['babel-loader'],
                loader: 'babel-loader',
                options: {
                  retainLines: true,
                }
              	// Use this for TypeScript (*.ts) files instead 'babel-loader'!
                //use: ['typescript-loader']
            },
            {   // loader for images
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: 'asset/resource',
                loader: 'file-loader',
                options: {
				          // dest directory images configuration - enable 'name.ext' file names (if not hash will be instead)
                  name: '[name].[ext]',
                  outputPath: 'img'
                }
            },
        ]
    }
}