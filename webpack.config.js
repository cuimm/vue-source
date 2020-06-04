const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[hash:8].js',
  },
  resolve: {
    modules: [path.resolve(__dirname, 'source'), path.resolve('node_modules')], // modules：指定webpack依赖模块路径搜索
    extensions: ['.js', '.jsx', '.json', '.css'],
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@source': path.resolve(__dirname, 'source'),
    },
  },
  plugins: [
    // 打包输出html
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      filename: 'index.html', // 如果输出带hash的文件名，通过webpack-dev-server启动之后浏览的是项目目录
      minify: {
        minifyCSS: true, // 压缩内连css
        removeComments: true, // 删除html中的注释
        collapseWhitespace: true, // 删除空格
      },
    }),
    // 打包自动删除dist目录
    new CleanWebpackPlugin(),
  ],
}
