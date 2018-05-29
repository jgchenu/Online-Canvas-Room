<template>
    <div class="loginPage">
            <button @getuserinfo="onGetUserinfo" open-type="getUserInfo" class="loginButton">用户授权</button>
            
    </div>
</template>

<script>
export default {
  methods: {
    onGetUserinfo(e) {
      //   console.log(e.detail.errMsg);
      //   console.log(e.detail.userInfo);
      //   console.log(e.detail.rawData);
      console.log(e);
      wx.openSetting({success:(res)=>{console.log(res);}});
      // wx.navigateTo({
      //   url: "../enter/main"
      // });
    }
  }
};
</script>

<style lang="scss" scoped>
.loginPage{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .loginButton{
        margin-top: 400rpx;
        width: 200rpx;
        height: 100rpx;
    }
}
</style>

