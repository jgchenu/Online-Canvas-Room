<template>
    <div class="loginPage">
            <button @getuserinfo="onGetUserInfo" open-type="getUserInfo" class="loginButton">用户授权</button>
            
    </div>
</template>

<script>
var util = require("../../utils/index.js");
export default {
  methods: {
    onGetUserInfo(e) {
      let msg = e.target.errMsg;
      if (msg === "getUserInfo:ok") {
        wx.navigateTo({
          url: "../enter/main"
        });
      } else {
        new Promise((resolve, reject) => {
          util.showTip("友情提示", "需要授权获取信息才能进行使用~");
          resolve();
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
    margin-top: 400rpx;
    width: 200rpx;
    height: 100rpx;
  }
}
</style>

