const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const exec = require('child_process').exec;

const indexConfig = {
    template: './index.html',
    excludeChunks: ['electron']
};

module.exports = {
    devtool: 'eval-source-map',
    devServer: {
        after() {
            exec('electron . --dev');
        }
    },
    entry: {
        'electron': './electron',
        'app': './app/main.ts'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    output: {
        path: path.resolve('./dist'),
        filename: '[name].js'
    },
    stats: {
        warnings: false
    },
    target: 'electron-main',
    node: {
        __dirname: false
    },
    plugins: [new HtmlWebpackPlugin(indexConfig)]
};