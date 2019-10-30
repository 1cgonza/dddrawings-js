const { resolve } = require('path');
const pkg = require('./package.json');
const libraryName = pkg.name;

const config = {
  entry: './src/index.js',
  output: {
    path: resolve(__dirname, 'lib'),
    filename: libraryName + '.js',
    library: libraryName,
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(glsl|vs|fs)$/,
        loader: 'shader-loader',
        options: {
          glsl: {
            chunkPath: resolve(__dirname, '/src/webgl/shaders')
          }
        }
      }
    ]
  }
};

module.exports = config;
