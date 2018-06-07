<template>
<div class="index">
 <div class="canvas" :style="{'left':offsetX+'rpx','top':offsetY+'rpx'}"> 
   <canvas 
   canvas-id="Canvas" 
   :style="{'height'
   :height+'rpx','width'
   :width+'rpx'}" 
   disable-scroll="true"  
   @touchstart="touchStart" 
   @touchmove="touchMove"
   @touchend="touchEnd" />
 </div> 
  <aside class="types" @click="choseType" v-if="identity==='created'">
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
    //调用监听服务器返回
    this.listenTunnel();
    this.ctx = wx.createContext();
    this.ctx.setStrokeStyle("#000000");
    this.ctx.setLineWidth(2);
    this.ctx.setLineCap("round"); // 让线条圆润
  },
  onLoad(option) {
    this.roomId = option.id;
    console.log(option.id);
    // this.sendMessage('speak',{'room-id':this.roomId,type:1})
  },
  data() {
    return {
      drawArr: [],
      prevPosition: [0, 0],
      w: 2,
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
  methods: {
    //映射
    ...mapMutations(["changeStatus", "changeRoomStatus"]),
    //触摸开始事件
    touchStart(e) {
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
    touchMove(e) {
      //判断是单手指
      if (this.chosen === "draw" || this.chosen === "eraser") {
        if (this.chosen === "draw") {
          this.ctx.setStrokeStyle("#000000");
          this.ctx.setLineWidth(2);
          this.ctx.setLineCap("round"); // 让线条圆润
        } else if (this.chosen == "eraser") {
          this.ctx.setStrokeStyle("#ffffff");
          this.ctx.setLineWidth(10);
          this.ctx.setLineCap("round"); // 让线条圆润
        }
        if (this.begin) {
          this.ctx.moveTo(this.startX, this.startY);
          this.startX = e.touches[0].x;
          this.startY = e.touches[0].y;
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
        this.prevPosition = [
          parseInt(e.touches[0].x),
          parseInt(e.touches[0].y)
        ];
      }
    },
    touchEnd() {
      if (this.choseType === "draw") {
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
      } else if (this.choseType === "move") {
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
      } else if (this.choseType === "eraser") {
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
      } else if (this.choseType === "clear") {
        this.sendMessage("speak", {
          "room-id": this.roomId,
          action: 2,
          data: {
            type: 4
          }
        });
      }

      this.drawArr = [];
      this.begin = false;
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
        // this.ctx.fillRect(0, 0, this.width, this.height);
        // this.ctx.setFillStyle("white");
        // this.ctx.clearRect(0, 0, this.width, this.height);
        // wx.drawCanvas({
        //   canvasId: "Canvas",
        //   reserve: true,
        //   actions: this.ctx.getActions() // 获取绘图动作数组
        // });
        wx.drawCanvas({
          canvasId: "Canvas",
          reserve: false,
          actions: [] // 获取绘图动作数组
        });
        this.chosen = "draw";
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
      tunnel.on("speak", data => {
        // util.showModel("信道消息", speak.word);
        console.log("收到说话消息：", data);
      });
    },
    /**
     * 点击「发送消息」按钮，测试使用信道发送消息
     */
    sendMessage(type, data = {}) {
      const { tunnel } = this.tunnel;
      if (!this.tunnelStatus || !this.tunnelStatus === "connected") return;
      // 使用 tunnel.isActive() 来检测当前信道是否处于可用状态
      if (this.tunnel && this.tunnel.isActive()) {
        // 使用信道给服务器推送「speak」消息
        this.tunnel.emit(type, data);
      }
    }
  },
  computed: {
    //全局的信道变量
    ...mapState(["tunnel", "identity", "roomState"])
  },
  store
};
</script><style scoped lang='scss'>
@import "../../scss/index.scss";
</style>