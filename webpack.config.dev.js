require('dotenv').load();

var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'GITHUB_CLIENT_ID': JSON.stringify(process.env.GITHUB_CLIENT_ID || ''),
        'HEROKU_CLIENT_ID': JSON.stringify(process.env.HEROKU_CLIENT_ID || ''),
        'HOST': JSON.stringify(process.env.HOST || '')
      }
    })
  ],
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel'], include: path.join(__dirname, 'src') },
      { test: /\.scss$/, loaders: ['style','css','sass']},
      { test: /\.(svg|png)$/, exclude: /node_modules/, loader: 'file-loader' }
    ]
  }
};
