var path = require('path');
var webpack = require('webpack');
 
module.exports = {
  entry: './src/js/index.jsx',
  output: { path: __dirname, filename: './public/bundle.js' },
  resolve: {
    extensions: ['.js','.jsx','.css','.less']
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        },
      }
    ]
  },
};
