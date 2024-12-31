const path = require('path');

module.exports = {
  entry: {
    app: './js/CodeGenerator.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: './js/CodeGenerator.js',
  },
};
