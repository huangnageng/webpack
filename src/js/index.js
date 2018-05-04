import "babel-polyfill";
import "../less/less.less"; //使用require导入css文件

import "./Greeter.js"; //使用require导入css文件
import "./css.js"; //使用require导入css文件
import "../es6/es6.js"; //使用require导入css文件

if (module.hot) {
  module.hot.accept("./Greeter.js", function() {
    console.log("Accepting the updated printMe module!");
  });
}
