var path = require('path');

module.exports = {
  entry: {
    lasergame: "./src/lasergame/frontend/lasergame.ts",
  },
  output: {
    filename: "[name]-bundle.js",
    path: path.resolve(__dirname, './public/bundles/'),
    library: "[name]"
  },
  resolve: {
    // Add '.ts' and '.tsx' as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"],
    modules: [path.resolve(__dirname, "src"), "node_modules"]
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