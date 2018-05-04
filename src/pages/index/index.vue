<template>
<div class="index">
  <canvas canvas-id="Canvas" v-bind:style="{'height':height+'rpx','width':width+'rpx','left':offsetX+'rpx','top':offsetY+'rpx'}" disable-scroll="true" @touchend="touchEnd" @touchstart="touchStart" @touchmove="touchMove"/>
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
      height: 1334,
      width: 750,
      offsetY:0
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
        let leftTwo = e.touches[1].x - this.gesPosition[1].x;
        let topOne=e.touches[0].y - this.gesPosition[0].y;
        let topTwo=e.touches[1].y - this.gesPosition[1].y;
        this.gesPosition = [
          { x: e.touches[0].x, y: e.touches[0].y },
          { x: e.touches[1].x, y: e.touches[1].y }
        ];
        if ((leftOne < 0 && leftTwo < 0) || (leftOne > 0 && leftTwo > 0)) {
          this.offsetX += leftOne>leftTwo?leftOne:leftTwo;
        }
        if ((topOne < 0 && topOne < 0) || (topOne > 0 && topTwo > 0)) {
          this.offsetY += topOne>topTwo?topOne:topTwo;
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