<template><div class="index"><canvas canvas-id="Canvas" disable-scroll="true" @touchend="touchEnd" @touchstart="touchStart" @touchmove="touchMove"/></div></template><script>
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
      width: 2,
      canvasHeight: 50,
      red: 33,
      green: 33,
      blue: 33,
      eraser: false,
      nextPosition: [0, 0]
    };
  },
  components: {},
  methods: {
    touchStart(e) {
      this.prevPosition = [e.touches[0].x, e.touches[0].y];
    },
    touchMove(e) {
      let ctx = wx.createCanvasContext("Canvas");
      if (!this.eraser) {
        ctx.setStrokeStyle(
          "rgb(" + this.red + ", " + this.green + ", " + this.blue + ")"
        );
        ctx.setLineWidth(this.width);
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
    },
    touchEnd(e) {}
  }
};
</script><style scoped lang='scss'>
@import "../../scss/index.scss";
</style>