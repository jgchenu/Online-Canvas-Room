<template>
<div class="index">
  
  <canvas  canvas-id="show" 
   :style="{'height'
   :height+'rpx','width'
   :width+'rpx','left':(offsetX)+'rpx','top':(offsetY)+'rpx'}" 
   disable-scroll="true"  
   />
   <canvas 
   canvas-id="Canvas" 
   :style="{'height'
   :height+'rpx','width'
   :width+'rpx','left':offsetX+'rpx','top':offsetY+'rpx'}" 
   disable-scroll="true"  
   @touchstart="touchStart" 
   @touchmove="touchMove"
   @touchend="touchEnd"
   :ref="'canvas'" class="canvas" 
   />

  <aside class="types" v-if="identity==='created'">
    <div v-for="(item,index) in types" :key="index" :class="{chosen:item==chosen}" class="type" @click="choseType(index)">
      <img :src="'http://test.jgchen.xin/canvas/'+item+'.png'" :alt="item">
    </div>
  </aside>
  <div v-if="identity==='join'" class="tip">
    <p>保存画板 
    <img :src="'http://test.jgchen.xin/canvas/save.png'"
    :alt="'save'"
    @click="choseType(4)">
    </p>
  </div>
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
    console.log(this.identity);
    this.listenTunnel();
    this.ctx = wx.createContext();
    //初始化画布背景色
    this.setBg();
    this.ctx.setStrokeStyle("#000000");
    this.ctx.setLineWidth(2);
    this.ctx.setLineCap("round"); // 让线条圆润
  },
  onLoad(option) {
    this.roomId = option.id;
    console.log(option.id);
    this.changeCanvasStatus(true);
    this.sendMessage("room", { "room-id": this.roomId });
  },
  onUnload() {
    this.changeCanvasStatus(false);
  },
  data() {
    return {
      drawArr: [],
      prevPosition: [0, 0],
      startX: 0,
      startY: 0,
      height: 1080,
      width: 2880,
      offsetX: 0,
      offsetY: 0,
      timer: null,
      types: ["draw", "move", "eraser", "clear", "save"],
      chosen: "draw",
      time: 0,
      roomId: "",
      drawWidth: 1,
      eraserWidth: 20
    };
  },
  components: {},
  methods: {
    getAuth() {
      wx.getSetting({
        success: res => {
          if (
            !res.authSetting["scope.userInfo"] ||
            !res.authSetting["scope.writePhotosAlbum"]
          ) {
            wx.openSetting({
              success: res => {
                console.log(res);
              }
            });
          }
        }
      });
    },
    //映射
    ...mapMutations(["changeStatus", "changeCanvasStatus"]),
    setBg() {
      this.ctx.setFillStyle("#ffffff");
      this.ctx.fillRect(0, 0, this.width, this.height);
      wx.drawCanvas({
        canvasId: "show",
        reserve: true,
        actions: this.ctx.getActions() // 获取绘图动作数组
      });
      this.ctx.clearActions();
    },
    //触摸开始事件
    touchStart(e) {
      if (this.identity !== "created") {
        return;
      }
      this.prevPosition = [e.touches[0].x, e.touches[0].y];
      this.startX = ~~(e.touches[0].x + 0.5);
      this.startY = ~~(e.touches[0].y + 0.5);
      this.drawArr.push({
        x: this.startX,
        y: this.startY
      });
    },
    //手指移动事件
    touchMove(e) {
      if (this.identity !== "created") {
        return;
      }

      //判断是单手指
      if (this.chosen === "draw" || this.chosen === "eraser") {
        if (this.chosen === "draw") {
          this.ctx.setStrokeStyle("#000000");
          this.ctx.setLineWidth(this.drawWidth);
        } else if (this.chosen == "eraser") {
          this.ctx.setStrokeStyle("white");
          this.ctx.setLineWidth(this.eraserWidth);
        }
        let x = ~~(e.touches[0].x + 0.5);
        let y = ~~(e.touches[0].y + 0.5);
        this.ctx.setLineJoin("round");
        this.ctx.setLineCap("round"); // 让线条圆润
        this.startX = x;
        this.startY = y;
        this.drawArr.push({
          x: this.startX,
          y: this.startY
        });
        let p1 = this.drawArr[0];
        let p2 = this.drawArr[1];
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        for (let i = 1; i < this.drawArr.length; i++) {
          let midPoint = this.midPoint(p1, p2);
          this.ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
          p1 = this.drawArr[i];
          p2 = this.drawArr[i + 1];
        }
        this.ctx.lineTo(p1.x, p1.y);
        this.ctx.stroke();
        this.ctx.closePath();
        wx.drawCanvas({
          canvasId: "Canvas",
          reserve: false,
          actions: this.ctx.getActions() // 获取绘图动作数组
        });
        this.ctx.clearActions();
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
      if (this.identity !== "created") {
        return;
      }
      if (this.chosen === "draw") {
        this.drawCanvas(this.drawWidth, "#000000", this.drawArr);
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
        this.drawCanvas(this.eraserWidth, "#ffffff", this.drawArr);
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
    choseType(index) {
      if (this.types[index] === "clear") {
        wx.showModal({
          title: "提示",
          content: "是否清空屏幕",
          success: res => {
            if (res.confirm) {
              console.log("用户点击确定");
              this.sendMessage("speak", {
                "room-id": this.roomId,
                action: 2,
                data: {
                  type: 4
                }
              });
              this.clearCanvas();
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
      } else if (this.types[index] === "save") {
        var self = this;
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: self.width,
          height: self.height,
          fileType: "jpg",
          canvasId: "show",
          success: function(res) {
            console.log(res.tempFilePath);
            self.tempFilePath = res.tempFilePath;
            util.showBusy("保存中", 15000);
            wx.saveImageToPhotosAlbum({
              filePath: self.tempFilePath,
              success: function(res) {
                util.showSuccess("保存成功");
                console.log("save");
              },
              fail: function(err) {
                console.log(err);
                util.showBusy("请先授权");
                setTimeout(() => {
                  self.getAuth();
                }, 1000);
              }
            });
          }
        });
      } else {
        this.chosen = this.types[index];
      }
    },
    //二次贝塞尔中间点计算
    midPoint(start, end) {
      let x = (start.x + end.x) / 2;
      let y = (start.y + end.y) / 2;
      var cp = {
        x: x,
        y: y
      };
      return cp;
    },
    //定时器
    setTimer() {
      this.timer = setTimeout(() => {
        this.timer = null;
      }, 8);
    },
    //监听tunnel
    listenTunnel() {
      var tunnel = this.tunnel;
      // 监听自定义消息（服务器进行推送）
      tunnel.on("speak", data => {
        if (this.identity !== "join") {
          console.log("不是用户");
          return;
        }
        this.recoverAction(data);
      });
      tunnel.on("room", data => {
        if (this.atCanvas) {
          util.showBusy("恢复画布状态中");
          this.recoverCanvas(data.room.data);
        }
      });
      tunnel.on("reconnect", () => {
        if (this.atCanvas) {
          this.sendMessage("room", { "room-id": this.roomId });
        }
      });
    },
    //绘画函数
    drawCanvas(width = 1, color = "#000000", drawArr = []) {
      this.ctx.setStrokeStyle(color);
      this.ctx.setLineWidth(width);
      this.ctx.setLineJoin("round");
      this.ctx.setLineCap("round"); // 让线条圆润
      let p1 = drawArr[0];
      let p2 = drawArr[1];
      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, p1.y);
      for (let i = 1; i < drawArr.length; i++) {
        let midPoint = this.midPoint(p1, p2);
        this.ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
        p1 = drawArr[i];
        p2 = drawArr[i + 1];
      }
      this.ctx.lineTo(p1.x, p1.y);
      this.ctx.stroke();
      this.ctx.closePath();
      wx.drawCanvas({
        canvasId: "show",
        reserve: true,
        actions: this.ctx.getActions() // 获取绘图动作数组
      });
      this.ctx.clearActions();
      wx.drawCanvas({
        canvasId: "Canvas",
        reserve: false,
        actions: [] // 获取绘图动作数组
      });
    },
    recoverCanvas(data) {
      for (let index = 0; index < data.length; index++) {
        this.recoverAction(data[index]);
      }
    },
    recoverAction(data) {
      const type = data.data.type;
      if (type === 1) {
        const drawArr = data.data.data.drawArr;
        this.drawCanvas(this.drawWidth, "#000000", drawArr);
      } else if (type === 2) {
        const offsetX = data.data.data.offsetX;
        this.offsetX = offsetX;
      } else if (type === 3) {
        const drawArr = data.data.data.drawArr;
        this.drawCanvas(this.eraserWidth, "#ffffff", drawArr);
      } else if (type === 4) {
        this.clearCanvas();
      }
    },
    clearCanvas() {
      wx.drawCanvas({
        canvasId: "Canvas",
        reserve: false,
        actions: [] // 获取绘图动作数组
      });
      wx.drawCanvas({
        canvasId: "show",
        reserve: false,
        actions: [] // 获取绘图动作数组
      });
      this.chosen = "draw";
      this.setBg();
    },
    sendMessage(type, data = {}) {
      // console.log(this.tunnel);
      // console.log(this.tunnelStatus);
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
    ...mapState(["tunnel", "identity", "tunnelStatus", "atCanvas"])
  },
  store
};
</script><style scoped lang='scss'>
@import "../../style/index.scss";
</style>