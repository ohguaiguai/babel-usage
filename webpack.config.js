const path = require('path');
module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env'
                // {
                //   useBuiltIns: 'usage',
                //   corejs: 3
                //   // targets: 'last 2 Chrome versions'
                //   // targets: ' > 0.25%'
                // }
              ]
            ],
            plugins: [
              [
                '@babel/plugin-transform-runtime',
                {
                  corejs: 3, // 根据用到的新特性，自动引入对应的polyfill
                  helpers: true, // 移除内联的 babel helpers, 并自动引入 babel-runtime/helpers,
                  regenerate: true // 使用 regenerator-runtime 来避免污染全局变量
                }
              ]
            ]
          }
        }
      }
    ]
  }
};
