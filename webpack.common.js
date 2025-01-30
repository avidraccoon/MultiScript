const path = require('path');

module.exports = {
  entry: {
    app: './js/Test.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: './js/Test.js',
  },
};
