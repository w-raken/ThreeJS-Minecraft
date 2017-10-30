const dev = process.env.NODE_ENV === "dev";
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const exec = require('child_process').exec;
const uglifyJs = require('uglifyjs-webpack-plugin')

const indexConfig = {
    template: './index.html',
    excludeChunks: ['electron']
};

module.exports = {
    devtool: dev ? 'eval-cheap-module-source-map' : false,
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
    plugins: [
        new htmlWebpackPlugin(indexConfig),
        new uglifyJs()
    ]
};