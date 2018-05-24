global.webpackJsonp([2],{

/***/ 14:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_mpvue_loader_1_0_13_mpvue_loader_lib_selector_type_script_index_0_index_vue__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_mpvue_loader_1_0_13_mpvue_loader_lib_template_compiler_index_id_data_v_566fd662_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_mpvue_loader_1_0_13_mpvue_loader_lib_selector_type_template_index_0_index_vue__ = __webpack_require__(31);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(27)
}
var normalizeComponent = __webpack_require__(4)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-566fd662"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_mpvue_loader_1_0_13_mpvue_loader_lib_selector_type_script_index_0_index_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_mpvue_loader_1_0_13_mpvue_loader_lib_template_compiler_index_id_data_v_566fd662_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_mpvue_loader_1_0_13_mpvue_loader_lib_selector_type_template_index_0_index_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\pages\\index\\index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-566fd662", Component.options)
  } else {
    hotAPI.reload("data-v-566fd662", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 18:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index__ = __webpack_require__(14);



var app = new __WEBPACK_IMPORTED_MODULE_0_vue___default.a(__WEBPACK_IMPORTED_MODULE_1__index__["a" /* default */]);
app.$mount();
/* harmony default export */ __webpack_exports__["default"] = ({
  config: {
    navigationBarTitleText: '小画板'
  }
});

/***/ }),

/***/ 24:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vuex_store_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuex__ = __webpack_require__(6);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

//
//
//
//
//
//
//
//
//
//
//
//



var qcloud = __webpack_require__(2);
var config = __webpack_require__(1);
var util = __webpack_require__(8);
/* harmony default export */ __webpack_exports__["a"] = ({
  mounted: function mounted() {
    var ctx = wx.createCanvasContext("Canvas");
    ctx.rect(0, 0, 600, 2668);
    ctx.setFillStyle("white");
    ctx.fill();
    ctx.draw();
    //调用监听服务器返回
    this.listenTunnel();
  },
  data: function data() {
    return {
      prevPosition: [0, 0],
      w: 2,
      red: 33,
      green: 33,
      blue: 33,
      location: [0, 0],
      gesPosition: [{ x: 0, y: 0 }, { x: 0, y: 0 }],
      height: 1334,
      width: 600,
      offsetX: 0,
      offsetY: 0,
      timer: null,
      types: ["pencil", "move", "eraser", "clear"],
      chosen: "pencil"
    };
  },

  components: {},
  methods: _extends({}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_vuex__["a" /* mapMutations */])(["changeStatus"]), {
    //触摸开始事件
    touchStart: function touchStart(e) {
      if (!this.isDouble(e)) {
        this.prevPosition = [parseInt(e.touches[0].x), parseInt(e.touches[0].y)];
        this.sendMessage();
        // this.setTimer();
      }
      // else if (this.isDouble(e)) {
      //   this.gesPosition = [
      //     { x: e.touches[0].x, y: e.touches[0].y },
      //     { x: e.touches[1].x, y: e.touches[1].y }
      //   ];
      // }
    },

    //手指移动事件
    touchMove: function touchMove(e) {
      var ctx = wx.createCanvasContext("Canvas");
      //判断是单手指
      if (this.chosen === "pencil" || this.chosen === "eraser") {
        if (this.chosen === "pencil") {
          ctx.setStrokeStyle("rgb(" + this.red + ", " + this.green + ", " + this.blue + ")");
          ctx.setLineWidth(this.w);
        } else if (this.chosen == "eraser") {
          ctx.setStrokeStyle("white");
          ctx.setLineWidth(10);
        }
        ctx.setLineCap("round");
        ctx.setLineJoin("round");
        if (!this.timer) {
          ctx.moveTo(this.prevPosition[0], this.prevPosition[1]);
          // this.setTimer();
        }
        ctx.lineTo(e.touches[0].x, e.touches[0].y);
        ctx.stroke();
        ctx.draw(true);
        this.prevPosition = [parseInt(e.touches[0].x), parseInt(e.touches[0].y)];
      } else if (this.chosen === "move") {
        this.offsetX += e.touches[0].x - this.prevPosition[0];
        this.offsetY += e.touches[0].y - this.prevPosition[1];
        this.prevPosition = [parseInt(e.touches[0].x), parseInt(e.touches[0].y)];
      }
    },

    //判断是否是单指
    isDouble: function isDouble(_ref) {
      var touches = _ref.touches;

      if (touches.length === 1) {
        return false;
      } else {
        return true;
      }
    },

    //选择动作类型
    choseType: function choseType(_ref2) {
      var target = _ref2.target;

      this.chosen = this.types[target.id];
      if (this.chosen === "clear") {
        var ctx = wx.createCanvasContext("Canvas");
        ctx.clearRect(0, 0, 600, 2668);
        ctx.setFillStyle("white");
        ctx.draw();
        this.chosen = "pencil";
      }
    },

    //定时器
    setTimer: function setTimer() {
      var _this = this;

      this.timer = setTimeout(function () {
        _this.timer = null;
      }, 8);
    },
    listenTunnel: function listenTunnel() {
      var tunnel = this.tunnel;
      // 监听自定义消息（服务器进行推送）
      tunnel.on("speak", function (speak) {
        util.showModel("信道消息", speak.word);
        console.log("收到说话消息：", speak);
      });
    },

    /**
     * 点击「发送消息」按钮，测试使用信道发送消息
     */
    sendMessage: function sendMessage() {
      if (!this.tunnelStatus || !this.tunnelStatus === "connected") return;
      // 使用 tunnel.isActive() 来检测当前信道是否处于可用状态
      if (this.tunnel && this.tunnel.isActive()) {
        // 使用信道给服务器推送「speak」消息
        this.tunnel.emit("speak", {
          word: "I say writing start at (" + this.prevPosition[0] + "," + this.prevPosition[1] + ")"
        });
      }
    }
  }),
  computed: _extends({}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_vuex__["b" /* mapState */])(["tunnel", "tunnelStatus"])),
  store: __WEBPACK_IMPORTED_MODULE_0__vuex_store_js__["a" /* default */]
});

/***/ }),

/***/ 27:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 31:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "index"
  }, [_c('div', {
    staticClass: "canvas",
    style: ({
      'left': _vm.offsetX + 'rpx',
      'top': _vm.offsetY + 'rpx'
    })
  }, [_c('canvas', {
    style: ({
      'height': _vm.height + 'rpx',
      'width': _vm.width + 'rpx'
    }),
    attrs: {
      "canvas-id": "Canvas",
      "disable-scroll": "true",
      "eventid": '0'
    },
    on: {
      "touchstart": _vm.touchStart,
      "touchmove": _vm.touchMove
    }
  })]), _vm._v(" "), _c('aside', {
    staticClass: "types",
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": _vm.choseType
    }
  }, _vm._l((_vm.types), function(item, index) {
    return _c('div', {
      key: index,
      staticClass: "type",
      class: {
        chosen: item == _vm.chosen
      },
      attrs: {
        "id": index
      }
    }, [_vm._v("\r\n      " + _vm._s(item) + "\r\n    ")])
  }))], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-566fd662", esExports)
  }
}

/***/ })

},[18]);
//# sourceMappingURL=main.js.map