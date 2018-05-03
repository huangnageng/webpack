const HtmlWebpackPlugin = require("html-webpack-plugin"); //通过 npm 安装
const babelpolyfill = require("babel-polyfill");
const webpack = require("webpack"); //访问内置的插件
const path = require("path");

const serverConfig = {
  target: "web",
  devtool: "eval-source-map",
  mode: "development",
  entry: {
    main: "./src/js/main.js"
  }, //已多次提及的唯一入口文件
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/lib.js"
    // publicPath: "/"
  },
  devServer: {
    contentBase: "./dist", //本地服务器所加载的页面所在的目录
    historyApiFallback: true, //不跳转
    // port: 9006,
    hot: true,
    inline: true //实时刷新
  },
  module: {
    rules: [
      {
        // 图片加载器
        test: /\.(png|jpg|gif|jpeg)$/,
        loader: "url-loader?limit=2048&name=images/[name].[ext]"
      },
      {
        test: /\.(htm|html)$/i,
        loader: "html-withimg-loader" //公共头部尾部引入
      },
      {
        test: /(\.jsx|\.js)$/,
        use: {
          loader: "babel-loader"
        },
        exclude: /node_modules/
      },
      {
        test: /\.(css|less)$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              modules: true, // 指定启用css modules
              localIdentName: "[local]" // 指定css的类名格式
            }
          },
          {
            loader: "less-loader" // compiles Less to CSS
          }
        ]
      }
    ]
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({
      filename: "html/index.html",
      template: "./src/html/index.html"
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};

module.exports = serverConfig;
