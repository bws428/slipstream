const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'slipstream.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
};