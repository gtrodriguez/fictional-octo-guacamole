var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './src/css/index.less',
  output: { path: __dirname, filename: './public/index.css' },
  resolve: {
    extensions: ['.css','.less']
  },
  module: {
      loaders: [{
          test: /\.less$/,
            use: [{
              loader: "style-loader" // creates style nodes from JS strings
          }, {
              loader: "css-loader" // translates CSS into CommonJS
          }, {
              loader: "less-loader" // compiles Less to CSS
          }]
      }]
  }
};