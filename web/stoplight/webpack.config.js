const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

let mode = "production";
//let mode = "development";

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
        main: path.resolve(__dirname, "./src/template.js"),
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
          title: "Stoplight sample of a finite state machine",
          template: path.resolve(__dirname, "./src/template.html"), // template for output index.html
          filename: "index.html", // name of output file
        }),

        // apply changes on fly
        // yarn add -D webpack-hot-middleware
        new webpack.HotModuleReplacementPlugin(),

        // build directory cleaning
        new CleanWebpackPlugin()
    ],

    module: {
        rules: [
            {   // loader for *.html files
                test: /\.(html)$/, use: ['html-loader']
            },
            {   // loader for *.css files
                test: /\.css$/, use: [ 'style-loader', 'css-loader' ]
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
