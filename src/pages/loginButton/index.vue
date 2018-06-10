<template>
    <div class="loginPage">
            <p>Online画室授权登录</p>
            <img src="http://test.jgchen.xin/canvas/logo.jpg" alt="logo">
            <button @getuserinfo="onGetUserinfo" open-type="getUserInfo" class="loginButton">允许</button>
            
    </div>
</template>

<script>
var util = require("../../utils/index.js");
export default {
  methods: {
    onGetUserinfo(e) {
      let msg = e.target.errMsg;
      console.log(e);
      if (msg === "getUserInfo:ok") {
        wx.redirectTo({
          url: "../enter/main"
        });
      } else {
        new Promise((resolve, reject) => {
          util.showBusy("需要授权才能使用~");
          setTimeout(() => {
            resolve();
          }, 1000);
        }).then(() => {
          wx.openSetting({
            success: res => {
              console.log(res);
            }
          });
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.loginPage {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .loginButton {
    margin-top: 100rpx;
    height: 80rpx;
    line-height: 80rpx;
    padding: 0 100rpx;
    background: #8B9CAC;
    color: #fff;
  }
  p{
    margin-top: 200rpx;
    color: #8B9CAC;
    text-align: center;
  }
  img{
    margin-top: 40rpx;
    border-radius: 50%;
    width: 200rpx;
    height: 200rpx;
  }
}
</style>

