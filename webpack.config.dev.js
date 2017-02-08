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
    new webpack.NoEmitOnErrorsPlugin(),
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
      { test: /\.js$/, loaders: ['babel-loader'], include: path.join(__dirname, 'src') },
      { test: /\.scss$/, loaders: ['style-loader','css-loader','sass-loader']},
      { test: /\.(svg|png)$/, exclude: /node_modules/, loader: 'file-loader' }
    ]
  }
};
