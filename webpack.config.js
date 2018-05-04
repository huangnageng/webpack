const HtmlWebpackPlugin = require("html-webpack-plugin"); //通过 npm 安装
const babelpolyfill = require("babel-polyfill");
const webpack = require("webpack"); //访问内置的插件
const path = require("path");
const glob = require("glob");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const serverConfig = {
  target: "web",
  devtool: "eval-source-map",
  mode: "development",
  entry: {
    // main: "./src/js/main.js"
    // index: "./src/js/index.js",
    // about: "./src/js/about.js"
  }, //已多次提及的唯一入口文件
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].js"
    // publicPath: "/"
  },
  devServer: {
    contentBase: "./dist/html", //本地服务器所加载的页面所在的目录
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
    // new CleanWebpackPlugin(["dist"]),
    new HtmlWebpackPlugin({
      filename: "html/index.html",
      template: "./src/html/index.html"
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};

// 获取指定路径下的入口文件
function getEntries(globPath) {
  var files = glob.sync(globPath),
    entries = {};

  files.forEach(function(filepath) {
    // 取倒数第二层(view下面的文件夹)做包名
    // var split = filepath.split("/");
    // var name = split[split.length - 1];

    var reg = /src\/html\/([0-9a-zA-z]*).html/i;
    var m = filepath.match(reg);
    var name = m[1];
    console.log(name);

    entries[name] = "./" + filepath;
  });

  return entries;
}

var entries = getEntries("src/html/**.html");

Object.keys(entries).forEach(function(name) {
  // 每个页面生成一个entry，如果需要HotUpdate，在这里修改entry
  // serverConfig.entry[name] = entries[name];
  serverConfig.entry[name] = "./src/js/" + [name] + ".js";
  console.log(serverConfig.entry);

  // 每个页面生成一个html
  var plugin = new HtmlWebpackPlugin({
    // 生成出来的html文件名
    filename: "html/" + name + ".html",
    // 每个html的模版，这里多个页面使用同一个模版
    template: "./src/html/" + name + ".html",
    // 自动将引用插入html
    inject: true,
    // 每个html引用的js模块，也可以在这里加上vendor等公用模块
    chunks: [name]
  });
  serverConfig.plugins.push(plugin);
});

module.exports = serverConfig;
