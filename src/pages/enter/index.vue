<template>
  <div class="enter">
    <img :src="room.qrCode" alt="" class="Qrcode">
    <button class="enterRoom room" @click="enterCanvas">进入画板</button>
    <section class="members">
          <img v-for="(item,index) in room.members" :key="index" :src="item.avatarUrl" />
    </section>
    <footer
      class="newRoom room"
      @click="createRoom"
      v-if="identity==='none'"
      >新建房间
    </footer>
    <footer
      class="newRoom room"
      @click="closeRoom"
      v-else-if="identity==='created'"
      >关闭房间
    </footer>
        <footer
      class="newRoom room"
      @click="quitRoom"
      v-else-if="identity==='join'"
      >退出房间
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
    this.listenTunnel();
    wx.getSetting({
      success: res => {
        if (!res.authSetting["scope.userInfo"]) {
          wx.navigateTo({
            url: "../loginButton/main"
          });
        }
      }
    });
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    // var scene = decodeURIComponent(options.scene);
    console.log(options);
    options.id = 21;
    this.room.roomId = options.id;
    if (options.id) {
      this.changeIdentityStatus("join");
      this.tunnel.emit("join", { "room-id": this.room.roomId });
    }
    this.openTunnel();
  },
  onUnload() {
    this.changeCanvasStatus(false);
  },
  data() {
    return {
      room: { qrCode: "", roomId: "", members: [] }
    };
  },
  methods: {
    ...mapMutations([
      "changeStatus",
      "changeIdentityStatus",
      "changeCanvasStatus"
    ]),
    enterCanvas() {
      if (this.identity === "created" || this.identity === "join") {
        wx.navigateTo({
          url: `../index/main?id=${this.room.roomId}`
        });
      } else {
        util.showTip("友情提示", "请先建立或者加入房间才能进入房间");
      }
    },
    createRoom() {
      this.sendMessage("create");
    },
    closeRoom() {
      this.sendMessage("shut", { "room-id": this.room.roomId });
    },
    quitRoom() {
      this.sendMessage("leave");
    },
    //信道连接跟监听
    openTunnel() {
      util.showBusy("信道建立中...");
      // 创建信道，需要给定后台服务地址
      var tunnel = this.tunnel;
      // 监听信道内置消息，包括 connect/close/reconnecting/reconnect/error
      tunnel.open();
      this.changeStatus("connecting");
    },
    listenTunnel() {
      var tunnel = this.tunnel;
      tunnel.on("connect", () => {
        util.showSuccess("信道建立成功");
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
      tunnel.on("errmsg", err => {
        //新建房间报错
        if (err.code === 40302) {
          util.showSuccess("房间已经创建");
          this.changeIdentityStatus("created");
        } else if (err.code === 40001) {
          util.showTip("报错", "参数错误");
        } else if (err.code === 40303) {
          util.showTip("提示", "你已经有加入房间了");
          this.room.roomId = err.room.id;
          this.sendMessage("room", { "room-id": this.room.roomId });
        } else if (err.code === 40304) {
          util.showTip("提示", "房间已经关闭");
          this.changeIdentityStatus("none");
        }
        console.log(err);
      });
      //新建房间
      tunnel.on("create", data => {
        this.room.qrCode = "data:image/jpeg;base64," + data.room.qrcode;
        this.room.roomId = data.room.id;
        console.log("create：", data);
        util.showTip("提示", "房间创建成功");
        this.changeIdentityStatus("created");
      });
      tunnel.on("error", err => {
        console.log("error:", err);
      });
      //监听用户信息
      tunnel.on("user", data => {
        // this.members.push({ avatarUrl: data.information.avatarUrl });
        if (data.room && data.room.created[0] && this.identity === "none") {
          this.room.roomId =
            data.room && data.room.created && data.room.created[0].id;
          this.room.qrCode = `data:image/jpeg;base64,${
            data.room.created[0].qrcode
          }`;
          this.changeIdentityStatus("created");
          this.sendMessage("room", { "room-id": this.room.roomId });
        }
        console.log("user:", data);
      });
      //监听加入信息
      tunnel.on("join", data => {
        console.log("join:", data);
        this.room.members = data.room.members;
        this.room.qrCode = `data:image/jpeg;base64,${data.room.qrcode}`;
        this.changeIdentityStatus("join");
      });
      //监听关闭房间信息
      tunnel.on("shut", data => {
        console.log("shut:", data);
        this.changeIdentityStatus("none");
        this.room.members = [];
        this.room.roomId = "";
        this.room.qrCode = "";
      });
      //监听房间的信息
      tunnel.on("room", data => {
        if (this.atCanvas) return;
        console.log("room", data);
        this.room.members = data.room.members;
        this.room.qrCode = `data:image/jpeg;base64,${data.room.qrcode}`;
        if (data.authority === 1) {
          this.changeIdentityStatus("created");
        } else if (data.authority === 2) {
          this.changeIdentityStatus("join");
        }
      });
      //监听退出房间的信息
      tunnel.on("leave", data => {
        if (!data.id) {
          this.room.members = [];
          this.room.qrCode = "";
          // util.showTip("提示", "你已经退出房间了");
        }
        console.log("leave:", data);
        this.changeIdentityStatus("none");
      });
    },
    sendMessage(type, data = {}) {
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
    ...mapState(["tunnel", "tunnelStatus", "identity", "atCanvas"])
  },
  store
};
</script>

<style lang="scss" scoped>
@import "../../scss/enter.scss";
</style>

