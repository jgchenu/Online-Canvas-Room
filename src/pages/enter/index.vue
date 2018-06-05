<template>
  <div class="enter">
    <img :src="userInfo.avatarUrl" alt="" class="QRcode">
    <button class="enterRoom room" @click="enterRoom">进入房间</button>
    <section class="members">
          <img v-for="(item,index) in members" :key="index" :src="item.imgUrl" />
    </section>
    <footer
      class="newRoom room"
      @click="newRoom"
      v-if="'closed'"
      >新建房间
    </footer>
    <footer
      class="newRoom room"
      @click="closeTunnel"
      v-else-if="'connected'"
      >关闭房间
    </footer>
    
  </div>
</template>
<script>
var qcloud = require("../../wafer/index");
var config = require("../../config");
var util = require("../../utils/index.js");
import store from "../vuex/store.js";
import { mapState, mapMutations } from "vuex";
export default {
  onLoad(options) {
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    // var scene = decodeURIComponent(options.scene);
    // console.log(scene);
    this.openTunnel();
    this.listenTunnel();
  },
  data() {
    return {
      members: [],
      userInfo: {},
      logged: false,
      takeSession: false,
      requestResult: ""
    };
  },
  methods: {
    ...mapMutations(["changeStatus", "changeRoomStatus"]),
    sendMessage(type, msg = {}) {
      if (!this.tunnelStatus || !this.tunnelStatus === "connected") return;

      // 使用 tunnel.isActive() 来检测当前信道是否处于可用状态
      if (this.tunnel && this.tunnel.isActive()) {
        // 使用信道给服务器推送「speak」消息
        this.tunnel.emit(type, msg);
      }
    },
    enterRoom() {
      if (this.tunnelStatus === "connected") {
        wx.navigateTo({
          url: "../index/main"
        });
      } else {
        util.showTip("友情提示", "请先建立房间才能进入房间");
      }
    },
    newRoom() {
      this.sendMessage("speak", {
        room_id: 1,
        data: { type: 1, data: { type1: [1, 2] } }
      });
    },
    //信道连接跟监听
    openTunnel() {
      util.showBusy("正在登录");
      // 创建信道，需要给定后台服务地址
      var tunnel = this.tunnel;
      // 监听信道内置消息，包括 connect/close/reconnecting/reconnect/error
      tunnel.on("connect", () => {
        // this.members.push({ imgUrl: this.userInfo.avatarUrl });
        util.showSuccess("登录成功");
        console.log("WebSocket 信道已连接");
        this.changeStatus("connected");
      });

      tunnel.on("close", () => {
        util.showSuccess("信道已断开");
        console.log("WebSocket 信道已断开");
        this.changeStatus("closed");
      });

      tunnel.on("reconnecting", () => {
        console.log("WebSocket 信道正在重连...");
        util.showBusy("正在重连");
      });

      tunnel.on("reconnect", () => {
        console.log("WebSocket 信道重连成功");
        util.showSuccess("重连成功");
        this.changeStatus("connected");
      });

      tunnel.on("error", error => {
        util.showModel("信道发生错误", error);
        console.error("信道发生错误：", error);
      });
      tunnel.open();
      this.changeStatus("connecting");
    },
    listenTunnel() {
      var tunnel = this.tunnel;
      tunnel.on("speak", data => {
        console.log("speak:", data);
      });
      tunnel.on("create", data => {
        console.log("create:", data);
      });
      tunnel.on("errmsg", data => {
        console.log("errmsg:", data);
      });
    },
    //  点击「关闭信道」按钮，关闭已经打开的信道
    closeTunnel() {
      if (this.tunnel) {
        util.showBusy("房间关闭中...");
        this.tunnel.close();
      }
      util.showSuccess("房间已关闭");
      this.members = [];
      this.changeStatus("closed");
    },
    login() {
      console.log(config.service.requestUrl);
      if (this.logged) return;
      util.showBusy("正在登录");
      var that = this;
      // 调用登录接口
      qcloud.login({
        success(result) {
          if (result) {
            util.showSuccess("登录成功");
            that.userInfo = result;
            that.logged = true;
          } else {
            // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
            qcloud.request({
              url: config.service.requestUrl,
              login: true,
              success(result) {
                util.showSuccess("登录成功");
                // that.userInfo = result.data.data;
                console.log(that.userInfo);
                that.logged = true;
              },
              fail(error) {
                util.showModel("请求失败", error);
                console.log("request fail", error);
              }
            });
          }
        },
        fail(error) {
          util.showModel("登录失败", error);
          console.log("登录失败", error);
        }
      });
    }
  },
  computed: {
    //全局的信道变量
    ...mapState(["tunnel", "tunnelStatus"])
  },
  store
};
</script>

<style lang="scss" scoped>
@import "../../scss/enter.scss";
</style>

