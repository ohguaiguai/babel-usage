# polyfill

- `@babel/preset-env` 默认只转换新的 javascript 语法，而不会转换新的 API，比如： Iterator, Generator, Set, Maps, Proxy, Reflect, Symbol, Promise 等全局对象，以及一些再全局对象上的方法（比如 Object.assign）都不会转码
- `@babel/polyfill` 可以模拟完整的 ES2015+环境
- 原理是在全局对象和内置对象的 prototype 上添加方法来实现，缺点是会污染全局空间
- V7.4.0 版本开始，`@babel/polyfill` 已经被废弃

### babel-loader 中的 useBuiltIns

可以配置为 false | 'entry' | 'usage'

1. 如果设置为 false， 此时不对 polyfill 做操作，如果引入@babel/polyfill 则无视配置的浏览器兼容，引入所有的 polyfill。

最终打包后结果

```js
asset main.js 946 KiB [emitted] (name: main)
```

2. 如果设置为 'entry', 则会根据配置的浏览器兼容范围(.browserslistrc 或者 webpack.config.js 中的 targets)，引入浏览器不兼容的 polyfill。还需要指定 core-js 的版本

core-js@3 引入方式:

```js
import 'core-js/stable';
import 'regenerator-runtime/runtime';
```

> core-js@2 分支已经不会再添加新特性, 不推荐使用。

最终打包后结果

```js
asset main.js 96.2 KiB [emitted] (name: main)
```

3. 如果配置为 'usage', 根据我们配置的浏览器兼容范围和我们代码里用到的新特性来导入对应的 polyfill，实现按需添加，并且我们不需要在入口处手动引入 polyfill,

最终打包结果

```js
asset main.js 1.35 KiB [emitted] (name: main)
```

## babel-runtime

- 为了解决 @babel/polyfill 污染全局空间的问题，这在编写`库`的时候比较常用。
- 提供了单独的包 babel-runtime 用以提供编译模块的工具函数
- babel-time，更像是一种按需加载的实现，比如你那里需要使用 Promise ，只要在这个文件头部引入 `import Promise from 'babel-runtime/core-js/promise'` 即可。

因为需要手动引入不方便，此时可以借助插件 `@babel/plugin-transform-runtime`

install

```js
npm i @babel/plugin-transform-runtime  @babel/runtime-corejs2 @babel/runtime-corejs3 -D
```

配置

```js
{
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env'
              ]
            ],
            plugins: [
              [
                '@babel/plugin-transform-runtime',
                {
                  corejs: 3, // 根据用到的新特性，自动引入对应的polyfill
                  helpers: true // 移除内联的 babel helpers, 并自动引入 babel-runtime/helpers
                }
              ]
            ]
          }
        }
      }
```

当设置 `helpers: true` 时会移除内联的 babel helpers, 并自动引入 babel-runtime/helpers, 可以看到自动引入了 `babel-runtime/helpers`

```js
var A = /*#__PURE__*/(0,_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__["default"])(function A() {
  (0,_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_5__["default"])(this, A);
});
var B = /*#__PURE__*/function (_A) {
  (0,_babel_runtime_corejs3_helpers_inherits__WEBPACK_IMPORTED_MODULE_1__["default"])(B, _A);
  var _super = _createSuper(B);
  function B() {
    (0,_babel_runtime_corejs3_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_5__["default"])(this, B);
    return _super.apply(this, arguments);
  }
  return (0,_babel_runtime_corejs3_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__["default"])(B);
}(A);
console.log(new B());
}();
```

当设置 `helpers: false` 时可以看到多了很多内联的 helper

```js
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof (_babel_runtime_corejs3_core_js_stable_symbol__WEBPACK_IMPORTED_MODULE_5___default()) && "symbol" == typeof (_babel_runtime_corejs3_core_js_stable_symbol_iterator__WEBPACK_IMPORTED_MODULE_6___default()) ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof (_babel_runtime_corejs3_core_js_stable_symbol__WEBPACK_IMPORTED_MODULE_5___default()) && obj.constructor === (_babel_runtime_corejs3_core_js_stable_symbol__WEBPACK_IMPORTED_MODULE_5___default()) && obj !== (_babel_runtime_corejs3_core_js_stable_symbol__WEBPACK_IMPORTED_MODULE_5___default().prototype) ? "symbol" : typeof obj; }, _typeof(obj); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); _babel_runtime_corejs3_core_js_stable_object_define_property__WEBPACK_IMPORTED_MODULE_1___default()(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = (_babel_runtime_corejs3_core_js_stable_object_set_prototype_of__WEBPACK_IMPORTED_MODULE_2___default()) ? _babel_runtime_corejs3_core_js_stable_object_set_prototype_of__WEBPACK_IMPORTED_MODULE_2___default().bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = _babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_4___default()(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_4___default())) return false; if ((_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_4___default().sham)) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(_babel_runtime_corejs3_core_js_stable_reflect_construct__WEBPACK_IMPORTED_MODULE_4___default()(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = (_babel_runtime_corejs3_core_js_stable_object_set_prototype_of__WEBPACK_IMPORTED_MODULE_2___default()) ? _babel_runtime_corejs3_core_js_stable_object_get_prototype_of__WEBPACK_IMPORTED_MODULE_3___default().bind() : function _getPrototypeOf(o) { return o.__proto__ || _babel_runtime_corejs3_core_js_stable_object_get_prototype_of__WEBPACK_IMPORTED_MODULE_3___default()(o); }; return _getPrototypeOf(o); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; _babel_runtime_corejs3_core_js_stable_object_define_property__WEBPACK_IMPORTED_MODULE_1___default()(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); _babel_runtime_corejs3_core_js_stable_object_define_property__WEBPACK_IMPORTED_MODULE_1___default()(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[(_babel_runtime_corejs3_core_js_stable_symbol_to_primitive__WEBPACK_IMPORTED_MODULE_0___default())]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
// import '@babel/polyfill';
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
// console.log(111, '', Array.isArray([]));
// let p = new Promise();
var A = /*#__PURE__*/_createClass(function A() {
  _classCallCheck(this, A);
});
var B = /*#__PURE__*/function (_A) {
  _inherits(B, _A);
  var _super = _createSuper(B);
  function B() {
    _classCallCheck(this, B);
    return _super.apply(this, arguments);
  }
  return _createClass(B);
}(A);
console.log(new B());
}();
```
