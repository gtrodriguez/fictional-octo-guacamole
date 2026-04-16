var path = require('path');

module.exports = {
  entry: './src/css/index.less',
  output: { path: path.resolve(__dirname, 'public'), filename: 'index.css.js' },
  resolve: {
    extensions: ['.css', '.less']
  },
  module: {
    rules: [{
      test: /\.less$/,
      use: [
        'style-loader',
        'css-loader',
        'less-loader'
      ]
    }]
  }
};
