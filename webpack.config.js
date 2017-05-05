var path = require('path');

module.exports = {
    entry: "./src/lasergame/lasergame.ts",
    output: {
        filename: "lasergame-bundle.js",
        path: path.resolve(__dirname, 'public/javascripts/lasergame/')
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