var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: {
    application: [
      web('css/application.scss'),
      web('js/application.js')
    ]
  },
  output: {
    path: join('priv/static'),
    filename: 'js/application.js',
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      },
      minimize: true
    }),
    new ExtractTextPlugin('css/application.css')
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          'style', 'css-loader!sass-loader?includePaths[]=' + __dirname +  '/node_modules'
        )
      },
      { test: /\.(svg|png)$/i,
        exclude: /node_modules/,
        loaders: ['file-loader','url-loader?limit=10000&name=../images/[name].[ext]']
      }
    ]
  }
};
