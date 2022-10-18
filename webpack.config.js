const path = require('path');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
    {
    name: 'demo',
    entry: path.join(__dirname, 'demo', 'src', 'main.js'),
        devtool: "inline-source-map",
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'demo', 'build'),
        clean: true
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'demo', 'build'),
        },
        hot: true,
    },
    plugins: [
        new NodePolyfillPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'demo', 'public', 'index.html'),
            title: 'Hot Module Replacement'
        })
    ],
    module: {
        // exclude node_modules
        rules: [
            {
                test: /\.(js|jsx)$/,         // <-- added `|jsx` here
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
        ],
    },
    // pass all js files through Babel
    resolve: {
        extensions: ["*", ".js", ".jsx"],    // <-- added `.jsx` here
    },
}];
