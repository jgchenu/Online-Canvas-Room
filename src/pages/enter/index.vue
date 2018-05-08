<template>
  <div class="enter">
    <img src="http://chenjianguang.com/static/images/1.jpg" alt="" class="QRcode">
    <header class="enterRoom room" @click="enterRoom">进入空间</header>
    <section class="members">
          <img v-for="(item,index) in members" :key="index" :src="item.imgUrl" />
    </section>
    <footer class="newRoom room" @click="newRoom">新建房间</footer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      members: [
        { imgUrl: "http://chenjianguang.com/static/images/5.jpg" },
        { imgUrl: "http://chenjianguang.com/static/images/2.jpg" },
        { imgUrl: "http://chenjianguang.com/static/images/3.jpg" },
        { imgUrl: "http://chenjianguang.com/static/images/4.jpg" },
        { imgUrl: "http://chenjianguang.com/static/images/5.jpg" },
        { imgUrl: "http://chenjianguang.com/static/images/6.jpg" },
        { imgUrl: "http://chenjianguang.com/static/images/7.jpg" },
        { imgUrl: "http://chenjianguang.com/static/images/8.jpg" },
        { imgUrl: "http://chenjianguang.com/static/images/1.jpg" }
      ]
    };
  },
  methods: {
    enterRoom() {
      wx.navigateTo({
        url: "../index/main"
      });
    },
    newRoom() {
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: res => {
              this.userInfo = res.userInfo;
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/enter.scss";
</style>

