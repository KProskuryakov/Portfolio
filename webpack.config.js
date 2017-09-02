var path = require('path');

module.exports = {
  entry: {
    lasergame: "./src/lasergame/frontend/FrontendLasergame.ts",
  },
  output: {
    filename: "[name]-bundle.js",
    path: path.resolve(__dirname, './public/bundles/'),
    library: "[name]"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  },
  node: {
    fs: "empty"
  }
}