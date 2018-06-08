global.webpackJsonp([2],{

/***/ 14:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_mpvue_loader_1_0_14_mpvue_loader_lib_selector_type_script_index_0_index_vue__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_mpvue_loader_1_0_14_mpvue_loader_lib_template_compiler_index_id_data_v_566fd662_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_mpvue_loader_1_0_14_mpvue_loader_lib_selector_type_template_index_0_index_vue__ = __webpack_require__(31);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_mpvue_loader_1_0_14_mpvue_loader_lib_selector_type_script_index_0_index_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_mpvue_loader_1_0_14_mpvue_loader_lib_template_compiler_index_id_data_v_566fd662_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_mpvue_loader_1_0_14_mpvue_loader_lib_selector_type_template_index_0_index_vue__["a" /* default */],
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
    //调用监听服务器返回
    this.listenTunnel();
    this.ctx = wx.createContext();
    this.ctx.setStrokeStyle("#000000");
    this.ctx.setLineWidth(2);
    this.ctx.setLineCap("round"); // 让线条圆润
  },
  onLoad: function onLoad(option) {
    this.roomId = option.id;
    console.log(option.id);
    // this.sendMessage('speak',{'room-id':this.roomId,type:1})
  },
  data: function data() {
    return {
      drawArr: [],
      prevPosition: [0, 0],
      red: 33,
      green: 33,
      blue: 33,
      startX: 0,
      startY: 0,
      height: 1100,
      width: 720,
      offsetX: 0,
      offsetY: 0,
      timer: null,
      types: ["draw", "move", "eraser", "clear"],
      chosen: "draw",
      time: 0,
      roomId: ""
    };
  },

  components: {},
  methods: _extends({}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_vuex__["a" /* mapMutations */])(["changeStatus", "changeRoomStatus"]), {
    //触摸开始事件
    touchStart: function touchStart(e) {
      this.prevPosition = [e.touches[0].x, e.touches[0].y];
      this.startX = e.touches[0].x;
      this.startY = e.touches[0].y;
      this.begin = true;
      this.ctx.beginPath();
      this.drawArr.push({
        x: this.startX,
        y: this.startY
      });
    },

    //手指移动事件
    touchMove: function touchMove(e) {
      var x = ~~(0.5 + e.touches[0].x);
      var y = ~~(e.touches[0].y + 0.5);
      //判断是单手指
      if (this.chosen === "draw" || this.chosen === "eraser") {
        if (this.chosen === "draw") {
          this.ctx.setStrokeStyle("#000000");
          this.ctx.setLineWidth(1);
        } else if (this.chosen == "eraser") {
          this.ctx.setStrokeStyle("#ffffff");
          this.ctx.setLineWidth(10);
        }
        this.ctx.setLineCap("round"); // 让线条圆润
        if (this.begin) {
          this.ctx.moveTo(this.startX, this.startY);
          this.startX = x;
          this.startY = y;
          this.ctx.lineTo(this.startX, this.startY);
          this.ctx.stroke();
          this.ctx.closePath();
          wx.drawCanvas({
            canvasId: "Canvas",
            reserve: true,
            actions: this.ctx.getActions() // 获取绘图动作数组
          });
          this.ctx.clearActions();
          this.drawArr.push({
            x: this.startX,
            y: this.startY
          });
        }
      } else if (this.chosen === "move") {
        this.offsetX += e.touches[0].x - this.prevPosition[0];
        // this.offsetY += e.touches[0].y - this.prevPosition[1];
        this.prevPosition = [parseInt(e.touches[0].x), parseInt(e.touches[0].y)];
      }
    },
    touchEnd: function touchEnd() {
      if (this.chosen === "draw") {
        this.sendMessage("speak", {
          "room-id": this.roomId,
          action: 1,
          data: {
            type: 1,
            data: {
              drawArr: this.drawArr
            }
          }
        });
      } else if (this.chosen === "move") {
        this.sendMessage("speak", {
          "room-id": this.roomId,
          action: 1,
          data: {
            type: 2,
            data: {
              offsetX: this.offsetX
            }
          }
        });
      } else if (this.chosen === "eraser") {
        this.sendMessage("speak", {
          "room-id": this.roomId,
          action: 1,
          data: {
            type: 3,
            data: {
              drawArr: this.drawArr
            }
          }
        });
      }
      this.drawArr = [];
      this.begin = false;
    },

    //选择动作类型
    choseType: function choseType(_ref) {
      var target = _ref.target;

      this.chosen = this.types[target.id];
      if (this.chosen === "clear") {
        // this.ctx.fillRect(0, 0, this.width, this.height);
        // this.ctx.setFillStyle("white");
        // this.ctx.clearRect(0, 0, this.width, this.height);
        // wx.drawCanvas({
        //   canvasId: "Canvas",
        //   reserve: true,
        //   actions: this.ctx.getActions() // 获取绘图动作数组
        // });
        this.sendMessage("speak", {
          "room-id": this.roomId,
          action: 2,
          data: {
            type: 4
          }
        });
        this.clearCanvas();
      }
    },

    //定时器
    setTimer: function setTimer() {
      var _this = this;

      this.timer = setTimeout(function () {
        _this.timer = null;
      }, 8);
    },

    //监听tunnel
    listenTunnel: function listenTunnel() {
      var _this2 = this;

      var tunnel = this.tunnel;
      // 监听自定义消息（服务器进行推送）
      tunnel.on("speak", function (data) {
        if (_this2.identity !== "join") {
          console.log("不是用户");
          return;
        }
        var type = data.data.type;
        if (type === 1) {
          var drawArr = data.data.data.drawArr;
          _this2.drawCanvas(1, "#000000", drawArr);
        } else if (type === 2) {
          var offsetX = data.data.data.offsetX;
          _this2.offsetX = offsetX;
        } else if (type === 3) {
          var _drawArr = data.data.data.drawArr;
          _this2.drawCanvas(10, "#ffffff", _drawArr);
        } else if (type === 4) {
          _this2.clearCanvas();
        }
        console.log("收到说话消息：", data);
      });
    },

    //绘画函数
    drawCanvas: function drawCanvas() {
      var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;
      var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "#000000";
      var drawArr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

      this.ctx.setStrokeStyle(color);
      this.ctx.setLineWidth(width);
      this.ctx.beginPath();

      var _drawArr$shift = drawArr.shift(),
          x = _drawArr$shift.x,
          y = _drawArr$shift.y;

      this.ctx.moveTo(x, y);
      for (var i = 0; i < drawArr.length; i++) {
        var item = drawArr[i];
        this.ctx.lineTo(item.x, item.y);
        this.ctx.stroke();
      }
      this.ctx.closePath();
      wx.drawCanvas({
        canvasId: "Canvas",
        reserve: true,
        actions: this.ctx.getActions() // 获取绘图动作数组
      });
      this.ctx.clearActions();
    },
    clearCanvas: function clearCanvas() {
      wx.drawCanvas({
        canvasId: "Canvas",
        reserve: false,
        actions: [] // 获取绘图动作数组
      });
      this.chosen = "draw";
    },
    sendMessage: function sendMessage(type) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      // console.log(this.tunnel);
      // console.log(this.tunnelStatus);
      var tunnel = this.tunnel.tunnel;

      if (!this.tunnelStatus || !this.tunnelStatus === "connected") return;
      // 使用 tunnel.isActive() 来检测当前信道是否处于可用状态
      if (this.tunnel && this.tunnel.isActive()) {
        // 使用信道给服务器推送「speak」消息
        this.tunnel.emit(type, data);
      }
    }
  }),
  computed: _extends({}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_vuex__["b" /* mapState */])(["tunnel", "identity", "tunnelStatus"])),
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
  }, [_c('canvas', {
    ref: 'canvas',
    staticClass: "canvas",
    style: ({
      'height': _vm.height + 'rpx',
      'width': _vm.width + 'rpx',
      'left': _vm.offsetX + 'rpx',
      'top': _vm.offsetY + 'rpx'
    }),
    attrs: {
      "canvas-id": "Canvas",
      "disable-scroll": "true",
      "eventid": '0'
    },
    on: {
      "touchstart": _vm.touchStart,
      "touchmove": _vm.touchMove,
      "touchend": _vm.touchEnd
    }
  }), _vm._v(" "), (_vm.identity === 'created') ? _c('aside', {
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
  })) : _vm._e()], 1)
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