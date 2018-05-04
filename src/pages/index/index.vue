<template>
<div class="index">
 <div class="canvas" :style="{'left':offsetX+'rpx','top':offsetY+'rpx'}"> 
   <canvas canvas-id="Canvas" v-bind:style="{'height':height+'rpx','width':width+'rpx'}" disable-scroll="true"  @touchstart="touchStart" @touchmove="touchMove" />
 </div> 
  <aside class="types" @click="choseType">
    <div v-for="(item,index) in types" :key="index" :class="{chosen:item==chosen}" class="type" :id="index">
      {{item}}
    </div>
  </aside>
</div>
</template>
<script>
export default {
  mounted() {
    let ctx = wx.createCanvasContext("Canvas");
    ctx.rect(0, 0, 600, 2668);
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
      location: [0, 0],
      gesPosition: [{ x: 0, y: 0 }, { x: 0, y: 0 }],
      offsetX: 0,
      height: 1334,
      width: 600,
      offsetY: 0,
      timer: null,
      types: ["pencil", "move", "eraser", "clear"],
      chosen: "pencil"
    };
  },
  components: {},
  methods: {
    touchStart(e) {
      if (!this.isDouble(e)) {
        this.prevPosition = [
          parseInt(e.touches[0].x),
          parseInt(e.touches[0].y)
        ];
        // this.setTimer();
      } else if (this.isDouble(e)) {
        this.gesPosition = [
          { x: e.touches[0].x, y: e.touches[0].y },
          { x: e.touches[1].x, y: e.touches[1].y }
        ];
      }
    },
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
    //判断是双手指
    // let leftOne = e.touches[0].x - this.gesPosition[0].x;
    // let leftTwo = e.touches[1].x - this.gesPosition[1].x;
    // let topOne = e.touches[0].y - this.gesPosition[0].y;
    // let topTwo = e.touches[1].y - this.gesPosition[1].y;
    // this.gesPosition = [
    //   { x: e.touches[0].x, y: e.touches[0].y },
    //   { x: e.touches[1].x, y: e.touches[1].y }
    // ];
    // if ((leftOne < 0 && leftTwo < 0) || (leftOne > 0 && leftTwo > 0)) {
    //   this.offsetX += leftOne > leftTwo ? leftOne : leftTwo;
    // }
    // if ((topOne < 0 && topOne < 0) || (topOne > 0 && topTwo > 0)) {
    //   this.offsetY += topOne > topTwo ? topOne : topTwo;
    // }

    isDouble({ touches }) {
      if (touches.length === 1) {
        return false;
      } else {
        return true;
      }
    },
    choseType({ target }) {
      this.chosen = this.types[target.id];
      if (this.chosen === 'clear') {
        let ctx = wx.createCanvasContext("Canvas");
        ctx.clearRect(0, 0, 600, 2668);
        ctx.setFillStyle("white");
        ctx.draw();
        this.chosen='pencil';
      }
    },
    setTimer() {
      this.timer = setTimeout(() => {
        this.timer = null;
      }, 8);
    }
  },
  computed() {}
};
</script><style scoped lang='scss'>
@import "../../scss/index.scss";
</style>