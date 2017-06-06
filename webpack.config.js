var path = require('path');

module.exports = {
  entry: {
    lasergame: "./src/lasergame-frontend/lasergame.ts",
  },
  output: {
    filename: "[name]/[name]-bundle.js",
    path: path.resolve(__dirname, './public/')
  },
  resolve: {
    // Add '.ts' and '.tsx' as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  }
}