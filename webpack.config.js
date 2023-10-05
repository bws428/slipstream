const path = require('path');

module.exports = {
  entry: './src/slipstream.js',
  output: {
    filename: 'slipstream.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
};