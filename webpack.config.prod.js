var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var cssLoaders = [
  {
    loader: 'css-loader'
  },
  {
    loader: 'sass-loader',
    options: {
      includePaths: join('/node_modules')
    }
  }
];
var imgLoaders = [
  { loader: 'file-loader' },
  { loader: 'url-loader',
    options: {
      limit: 10000,
      name: '../images/[name].[ext]'
    }
  }
];

function join(dest) { return path.resolve(__dirname, dest); }

function web(dest) { return join('web/static/' + dest); }

module.exports = {
  devtool: 'source-map',
  entry: {
    application: [
      'babel-polyfill',
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
    new ExtractTextPlugin('css/application.css')
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: cssLoaders,
          fallback: 'style-loader'
        })
      },
      {
        test: /\.(svg|png)$/i,
        exclude: [/node_modules/],
        use: imgLoaders
      }
    ]
  }
};
