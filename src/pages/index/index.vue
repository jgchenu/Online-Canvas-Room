<template>
<div class="index">
  <canvas canvas-id="Canvas" disable-scroll="true" :style="{left:offsetX+'rpx',width:width+'rpx',height:height+'rpx'}" @touchend="touchEnd" @touchstart="touchStart" @touchmove="touchMove"/>
</div>
</template>
<script>
export default {
  mounted() {
    let ctx = wx.createCanvasContext("Canvas");
    ctx.rect(0, 0, 1500, 2668);
    ctx.setFillStyle("white");
    ctx.fill();
    ctx.draw();
  },
  data() {
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
      height: 2668,
      width: 1500
    };
  },
  components: {},
  methods: {
    touchStart(e) {
      if (!this.isDouble(e)) {
        this.prevPosition = [e.touches[0].x, e.touches[0].y];
      } else if (this.isDouble(e)) {
        this.gesPosition = [
          { x: e.touches[0].x, y: e.touches[0].y },
          { x: e.touches[1].x, y: e.touches[1].y }
        ];
      }
    },
    touchMove(e) {
      let ctx = wx.createCanvasContext("Canvas");
      if (!this.isDouble(e)) {
        //判断是单手指
        if (!this.eraser) {
          ctx.setStrokeStyle(
            "rgb(" + this.red + ", " + this.green + ", " + this.blue + ")"
          );
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
        let leftOne = e.touches[0].x - this.gesPosition[0].x;
        let lefttwo = e.touches[1].x - this.gesPosition[1].x;
        let topOne = e.touches[0].y - this.gesPosition[0].x;
        let topTwo = e.touches[1].y - this.gesPosition[1].y;
        if (leftOne < 0 && lefttwo < 0) {
          console.log("手指向左右滑动了");
          this.height = this.height * 1.1;
          this.width = this.width * 1.1;
          if (leftOne > lefttwo) {
            // this.offsetX += leftOne;
          } else {
            // this.offsetX+=lefttwo;
          }
        } else if (leftOne > 0 && lefttwo > 0) {
          this.height = this.height / 1.1;
          this.width = this.width / 1.1;
        }
        console.log(e.touches);
      }
    },
    touchEnd(e) {},
    isDouble({ touches }) {
      if (touches.length === 1) {
        return false;
      } else {
        return true;
      }
    }
  }
};
</script><style scoped lang='scss'>
@import "../../scss/index.scss";
</style>