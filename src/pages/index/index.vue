<template>
<div class="index">
 <div class="canvas" :style="{'left':offsetX+'rpx','top':offsetY+'rpx'}"> 
   <canvas canvas-id="Canvas" :style="{'height':height+'rpx','width':width+'rpx'}" disable-scroll="true"  @touchstart="touchStart" @touchmove="touchMove" />
 </div> 
  <aside class="types" @click="choseType">
    <div v-for="(item,index) in types" :key="index" :class="{chosen:item==chosen}" class="type" :id="index">
      {{item}}
    </div>
  </aside>
</div>
</template>
<script>
import store from "../vuex/store.js";
import { mapState, mapMutations } from "vuex";
var qcloud = require("../../wafer/index");
var config = require("../../config");
var util = require("../../utils/index.js");
export default {
  mounted() {
    let ctx = wx.createCanvasContext("Canvas");
    ctx.rect(0, 0, 600, 2668);
    ctx.setFillStyle("white");
    ctx.fill();
    ctx.draw();
    //调用监听服务器返回
    this.listenTunnel();
  },
  data() {
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
  methods: {
    //映射
    ...mapMutations(["changeStatus"]),
    //触摸开始事件
    touchStart(e) {
      if (!this.isDouble(e)) {
        this.prevPosition = [
          parseInt(e.touches[0].x),
          parseInt(e.touches[0].y)
        ];
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
    touchMove(e) {
      let ctx = wx.createCanvasContext("Canvas");
      //判断是单手指
      if (this.chosen === "pencil" || this.chosen === "eraser") {
        if (this.chosen === "pencil") {
          ctx.setStrokeStyle(
            "rgb(" + this.red + ", " + this.green + ", " + this.blue + ")"
          );
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
        this.prevPosition = [
          parseInt(e.touches[0].x),
          parseInt(e.touches[0].y)
        ];
      } else if (this.chosen === "move") {
        this.offsetX += e.touches[0].x - this.prevPosition[0];
        this.offsetY += e.touches[0].y - this.prevPosition[1];
        this.prevPosition = [
          parseInt(e.touches[0].x),
          parseInt(e.touches[0].y)
        ];
      }
    },
    //判断是否是单指
    isDouble({ touches }) {
      if (touches.length === 1) {
        return false;
      } else {
        return true;
      }
    },
    //选择动作类型
    choseType({ target }) {
      this.chosen = this.types[target.id];
      if (this.chosen === "clear") {
        let ctx = wx.createCanvasContext("Canvas");
        ctx.clearRect(0, 0, 600, 2668);
        ctx.setFillStyle("white");
        ctx.draw();
        this.chosen = "pencil";
      }
    },
    //定时器
    setTimer() {
      this.timer = setTimeout(() => {
        this.timer = null;
      }, 8);
    },
    listenTunnel() {
      var tunnel = this.tunnel;
      // 监听自定义消息（服务器进行推送）
      tunnel.on("speak", speak => {
        util.showModel("信道消息", speak.word);
        console.log("收到说话消息：", speak);
      });
    },
    /**
     * 点击「发送消息」按钮，测试使用信道发送消息
     */
    sendMessage() {
      if (!this.tunnelStatus || !this.tunnelStatus === "connected") return;
      // 使用 tunnel.isActive() 来检测当前信道是否处于可用状态
      if (this.tunnel && this.tunnel.isActive()) {
        // 使用信道给服务器推送「speak」消息
        this.tunnel.emit("speak", {
          word: `I say writing start at (${this.prevPosition[0]},${
            this.prevPosition[1]
          })`
        });
      }
    }
  },
  computed: {
    //全局的信道变量
    ...mapState(["tunnel", "tunnelStatus"])
  },
  store
};
</script><style scoped lang='scss'>
@import "../../scss/index.scss";
</style>