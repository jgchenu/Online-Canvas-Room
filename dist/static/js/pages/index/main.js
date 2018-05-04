global.webpackJsonp([3],{

/***/ 15:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
  mounted: function mounted() {
    var ctx = wx.createCanvasContext("Canvas");
    ctx.rect(0, 0, 1500, 2668);
    ctx.setFillStyle("white");
    ctx.fill();
    ctx.draw();
  },
  data: function data() {
    return {
      prevPosition: [0, 0],
      w: 2,
      canvasHeight: 50,
      red: 33,
      green: 33,
      blue: 33,
      eraser: false,
      location: [0, 0],
      gesPosition: [{ x: 0, y: 0 }, { x: 0, y: 0 }],
      offsetX: 0,
      height: 1334,
      width: 750,
      offsetY: 0
    };
  },

  components: {},
  methods: {
    touchStart: function touchStart(e) {
      if (!this.isDouble(e)) {
        this.prevPosition = [e.touches[0].x, e.touches[0].y];
      } else if (this.isDouble(e)) {
        this.gesPosition = [{ x: e.touches[0].x, y: e.touches[0].y }, { x: e.touches[1].x, y: e.touches[1].y }];
      }
    },
    touchMove: function touchMove(e) {
      var ctx = wx.createCanvasContext("Canvas");
      if (!this.isDouble(e)) {
        //判断是单手指
        if (!this.eraser) {
          ctx.setStrokeStyle("rgb(" + this.red + ", " + this.green + ", " + this.blue + ")");
          ctx.setLineWidth(this.w);
        } else {
          ctx.setStrokeStyle("white");
          ctx.setLineWidth(10);
        }
        ctx.setLineCap("round");
        ctx.setLineJoin("round");
        ctx.moveTo(this.prevPosition[0], this.prevPosition[1]);
        ctx.lineTo(e.touches[0].x, e.touches[0].y);
        ctx.stroke();
        ctx.draw(true);
        this.prevPosition = [e.touches[0].x, e.touches[0].y];
      } else if (this.isDouble(e)) {
        //判断是双手指

        var leftOne = e.touches[0].x - this.gesPosition[0].x;
        var leftTwo = e.touches[1].x - this.gesPosition[1].x;
        var topOne = e.touches[0].y - this.gesPosition[0].y;
        var topTwo = e.touches[1].y - this.gesPosition[1].y;
        this.gesPosition = [{ x: e.touches[0].x, y: e.touches[0].y }, { x: e.touches[1].x, y: e.touches[1].y }];
        if (leftOne < 0 && leftTwo < 0 || leftOne > 0 && leftTwo > 0) {
          this.offsetX += leftOne > leftTwo ? leftOne : leftTwo;
        }
        if (topOne < 0 && topOne < 0 || topOne > 0 && topTwo > 0) {
          this.offsetY += topOne > topTwo ? topOne : topTwo;
        }
        console.log(e.touches);
      }
    },
    touchEnd: function touchEnd(e) {},
    isDouble: function isDouble(_ref) {
      var touches = _ref.touches;

      if (touches.length === 1) {
        return false;
      } else {
        return true;
      }
    }
  }
});

/***/ }),

/***/ 19:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 25:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "index"
  }, [_c('canvas', {
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
      "touchend": _vm.touchEnd,
      "touchstart": _vm.touchStart,
      "touchmove": _vm.touchMove
    }
  })])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-566fd662", esExports)
  }
}

/***/ }),

/***/ 4:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_mpvue_loader_lib_selector_type_script_index_0_index_vue__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_mpvue_loader_lib_template_compiler_index_id_data_v_566fd662_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_mpvue_loader_lib_selector_type_template_index_0_index_vue__ = __webpack_require__(25);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(19)
}
var normalizeComponent = __webpack_require__(1)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-566fd662"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_mpvue_loader_lib_selector_type_script_index_0_index_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_mpvue_loader_lib_template_compiler_index_id_data_v_566fd662_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_mpvue_loader_lib_selector_type_template_index_0_index_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\pages\\index\\index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
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

/***/ 9:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index__ = __webpack_require__(4);



var app = new __WEBPACK_IMPORTED_MODULE_0_vue___default.a(__WEBPACK_IMPORTED_MODULE_1__index__["a" /* default */]);
app.$mount();

/***/ })

},[9]);
//# sourceMappingURL=main.js.map