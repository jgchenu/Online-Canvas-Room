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
    // { imgUrl: "http://chenjianguang.com/static/images/5.jpg" },
    // { imgUrl: "http://chenjianguang.com/static/images/2.jpg" },
    // { imgUrl: "http://chenjianguang.com/static/images/3.jpg" },
    // { imgUrl: "http://chenjianguang.com/static/images/4.jpg" },
    // { imgUrl: "http://chenjianguang.com/static/images/5.jpg" },
    // { imgUrl: "http://chenjianguang.com/static/images/6.jpg" },
    // { imgUrl: "http://chenjianguang.com/static/images/7.jpg" },
    // { imgUrl: "http://chenjianguang.com/static/images/8.jpg" },
    // { imgUrl: "http://chenjianguang.com/static/images/1.jpg" }
    // login() {
    //   console.log(config.service.requestUrl);
    //   if (this.logged) return;

    //   util.showBusy("正在登录");
    //   var that = this;

    //   // 调用登录接口
    //   qcloud.login({
    //     success(result) {
    //       if (result) {
    //         util.showSuccess("登录成功");
    //         that.userInfo = result;
    //         that.logged = true;
    //       } else {
    //         // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
    //         qcloud.request({
    //           url: config.service.requestUrl,
    //           login: true,
    //           success(result) {
    //             util.showSuccess("登录成功");
    //             that.userInfo = result.data.data;
    //             console.log(that.userInfo);
    //             that.logged = true;
    //           },
    //           fail(error) {
    //             util.showModel("请求失败", error);
    //             console.log("request fail", error);
    //           }
    //         });
    //       }
    //     },

    //     fail(error) {
    //       util.showModel("登录失败", error);
    //       console.log("登录失败", error);
    //     }
    //   });
    // },

