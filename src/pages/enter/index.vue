<template>
  <div>
    <p v-if="tunnelStatus!=='connected'" class="tip3">长时间加载不出来？请下拉页面重新加载信息</p>
    <div class="enter" v-if="tunnelStatus==='connected'">
      <img src="http://test.jgchen.xin/canvas/扫码.png" alt="扫码" class="scanQrcode" @click="scanQrcode">
      <img :src="room.qrCode" alt="" class="Qrcode">
      <p class="tip">{{tip}}</p>
      <button class="enterRoom room"
      @click="enterCanvas"
      v-if="identity==='created'||identity==='join'">
      进入画板</button>
      <section class="members" v-if="identity==='created'||identity==='join'">
            <img v-for="(item,index) in room.members" :key="index" :src="item.avatarUrl" />
      </section>
      <footer
        class="newRoom room"
        @click="createRoom"
        v-if="identity==='none'"
        >新建房间
      </footer>
      <footer
        class="newRoom room closeRoom"
        @click="closeRoom"
        v-else-if="identity==='created'"
        >关闭房间
      </footer>
          <footer
        class="newRoom room quitRoom"
        @click="quitRoom"
        v-else-if="identity==='join'"
        >退出房间
      </footer>
      <p class="tip2" v-if="identity==='none'">Tips:在右上方扫码加入别人的房间</p>
    </div>
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
    this.getAuth();
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    console.log(options);
    // options.id = 21;
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      const id = scene.split("=")[2];
      this.room.roomId = id;
      this.changeIdentityStatus("join");
      this.tunnel.emit("join", { "room-id": this.room.roomId });
    }
    if (options.result) {
      const id = options.result.split("=")[2];
      this.room.roomId = id;
      this.changeIdentityStatus("join");
      this.tunnel.emit("join", { "room-id": this.room.roomId });
    }

    this.openTunnel();
  },
  onPullDownRefresh() {
    this.closeTunnel();
    this.openTunnel();
    this.getAuth();
    wx.stopPullDownRefresh();
  },
  data() {
    return {
      user: { roomId: "" },
      room: { qrCode: "", roomId: "", members: [] },
      tip: "您需要创建一个房间后才可以加入自己的在线画板"
    };
  },
  methods: {
    getAuth() {
      wx.getSetting({
        success: res => {
          if (!res.authSetting["scope.userInfo"]) {
            wx.redirectTo({
              url: "../loginButton/main"
            });
          }
        }
      });
    },
    ...mapMutations([
      "changeStatus",
      "changeIdentityStatus",
      "changeCanvasStatus"
    ]),
    scanQrcode() {
      wx.scanCode({
        success: res => {
          const id = res.result.split("=")[2];
          this.room.roomId = id;
          this.changeIdentityStatus("join");
          this.tunnel.emit("join", { "room-id": this.room.roomId });
        }
      });
    },
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
      wx.showModal({
        title: "提示",
        content: "是否关闭房间",
        success: res => {
          if (res.confirm) {
            console.log("用户点击确定");
            this.sendMessage("shut", { "room-id": this.room.roomId });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    quitRoom() {
      wx.showModal({
        title: "提示",
        content: "是否退出房间",
        success: res => {
          if (res.confirm) {
            console.log("用户点击确定");
            this.sendMessage("leave");
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    //信道连接跟监听
    openTunnel() {
      util.showBusy("信道建立中...", 15000);
      // 创建信道，需要给定后台服务地址
      var tunnel = this.tunnel;
      // 监听信道内置消息，包括 connect/close/reconnecting/reconnect/error
      tunnel.open();
      this.changeStatus("connecting");
    },
    closeTunnel() {
      if (this.tunnel) {
        this.tunnel.close();
      }
      util.showBusy("信道连接中...");
      this.changeStatus("closed");
    },
    listenTunnel() {
      var tunnel = this.tunnel;
      tunnel.on("connect", () => {
        util.showSuccess("信道建立成功");
        console.log("WebSocket 信道已连接");
        this.changeStatus("connected");
      });

      tunnel.on("close", () => {
        util.showBusy("信道已断开");
        console.log("WebSocket 信道已断开");
        this.changeStatus("closed");
      });

      tunnel.on("reconnecting", () => {
        console.log("WebSocket 信道正在重连...");
        util.showBusy("信道正在重连...", 15000);
      });

      tunnel.on("reconnect", () => {
        console.log("WebSocket 信道重连成功");
        util.showSuccess("重连成功");
        this.changeStatus("connected");
        this.sendMessage("room", { "room-id": this.room.roomId });
      });
      tunnel.on("errmsg", err => {
        //新建房间报错
        if (err.code === 40302) {
          util.showSuccess("房间已经创建");
          this.changeIdentityStatus("created");
        } else if (err.code === 40001) {
          // util.showTip("报错", "参数错误");
        } else if (err.code === 40303) {
          util.showTip("提示", "你已经有加入房间了");
          this.room.roomId = err.room.id;
          this.sendMessage("room", { "room-id": this.room.roomId });
        } else if (err.code === 40304) {
          // util.showTip("提示", "房间已经关闭");
          this.changeIdentityStatus("none");
          this.room.qrcode = "";
          this.room.members = [];
          this.room.roomId = "";
        }
        console.log(err);
      });
      //新建房间
      tunnel.on("create", data => {
        this.room.qrCode = "data:image/jpeg;base64," + data.room.qrcode;
        this.room.roomId = data.room.id;
        this.sendMessage("room", { "room-id": this.room.roomId });
        console.log("create：", data);
        // util.showTip("提示", "房间创建成功");
        this.changeIdentityStatus("created");
        this.tip = "邀请好友扫码加入房间";
      });
      tunnel.on("error", err => {
        console.log("error:", err);
      });
      //监听用户信息
      tunnel.on("user", data => {
        this.changeStatus("connected");
        util.showBusy("信道连接成功");
        // this.members.push({ avatarUrl: data.information.avatarUrl });
        if (data.room && data.room.created[0]) {
          this.room.roomId =
            data.room && data.room.created && data.room.created[0].id;
          this.room.qrCode = `data:image/jpeg;base64,${
            data.room.created[0].qrcode
          }`;
          this.changeIdentityStatus("created");
          this.sendMessage("room", { "room-id": this.room.roomId });
          this.user.roomId = data.room.created[0].id;
        }
        console.log("user:", data);
      });
      //监听加入信息
      tunnel.on("join", data => {
        console.log("join:", data);
        this.room.members = data.room.members;
        this.room.qrCode = `data:image/jpeg;base64,${data.room.qrcode}`;
        this.room.roomId = data.room.id;
        this.sendMessage("room", { "room-id": this.room.roomId });
      });
      //监听关闭房间信息
      tunnel.on("shut", data => {
        console.log("shut:", data);
        this.changeIdentityStatus("none");
        this.room.members = [];
        this.room.roomId = "";
        this.room.qrCode = "";
        this.tip = "您需要创建一个房间后才可以加入自己的在线画板";
      });
      //监听房间的信息
      tunnel.on("room", data => {
        if (this.atCanvas) return;
        console.log("room", data);
        this.room.members = data.room.members;
        this.room.qrCode = `data:image/jpeg;base64,${data.room.qrcode}`;
        if (data.authority === 1) {
          this.changeIdentityStatus("created");
          this.tip = "邀请好友扫码加入房间";
        } else if (data.authority === 2) {
          this.tip = "邀请好友扫码加入房间";
          this.changeIdentityStatus("join");
        }
      });
      //监听退出房间的信息
      tunnel.on("leave", data => {
        if (!data.room) {
          this.room.members = [];
          this.room.qrCode = "";
          this.changeIdentityStatus("none");
          this.sendMessage("room", { "room-id": this.user.roomId });
          // util.showTip("提示", "你已经退出房间了");
        } else {
          this.room.members = data.room.members;
        }

        console.log("leave:", data);
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
@import "../../style/enter.scss";
</style>

