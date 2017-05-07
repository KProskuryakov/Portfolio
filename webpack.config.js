// @ts-nocheck
var path = require('path');

module.exports = {
    entry: {
        lasergame: "./src/lasergame/lasergame.ts",
        secondgame: "./src/secondgame/weirdgame.ts"
    },
    output: {
        filename: "[name]-bundle.js",
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        loaders: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    }
}