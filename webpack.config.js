var path = require('path');

module.exports = {
  entry: './src/js/index.jsx',
  output: { path: __dirname, filename: './public/bundle.js' },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.less']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        }
      }
    ]
  }
};
