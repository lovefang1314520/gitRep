var login = require('../../common/login.js');
var couponService = require("../minecoupons/minecoupons.service");
var config = require('../../config/config.js');
var tips = require('../../components/tips.js');
var app = getApp();
Page({
  data: {
    userInfo: null,
    orderTypes: [{ id: "wait-pay", text: "待付款" }, { id: "wait-fahuo", text: "待发货" }, { id: "wait-receive-huo", text: "待收货" }, { id: "success", text: "已完成" }]
  },
  
  onShow() {
    wx.setNavigationBarTitle({
      title: "我的"
    });
    let that = this;
    if (!app.userInfoReadyState) {
      app.userInfoReady(app)
      .then(() => {
        const userInfo = app.globalData.userInfo;
        userInfo.memberAmount = (userInfo.memberAmount||0).toFixed(2)
        this.setData({
          userInfo
        })
      })
      .then(()=>{
        couponService.getMyCoupons().then((res) => {
          that.setData({
            validCouponCount: res.coupons.length
          })
        })
      })
    } else {
      const userInfo = app.globalData.userInfo;
      this.setData({
        userInfo
      });
      couponService.getMyCoupons().then((res) => {
        that.setData({
          validCouponCount: res.coupons.length
        })
      })
    }
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffd600',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })

  },
  openchat() {
     tips.show(this, '亲，正在开发中', 1000);

  },
  onReady() {


  },
  gotoLogin(){
    wx.navigateTo({
      url: '/pages/login/login'
    });


  },
  toChongzhi(){

    wx.navigateTo({
      url: '/pages/chongzhi/chongzhi'
    });

  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  onLoad: function () {
    this.setData({
      opentime: config.openTime
    })
  },
  scanFun() {
    tips.show(this, '扫码购物，正在开发中', 1000);
    return
    wx.scanCode({
      scanType: ['qrCode'],
      success: function (text) {

        // var thisCode = text.result;
        // wx.navigateTo({
        //   url: '/pages/product/product?scancode=' + thisCode,
        // })
      },
      fail: function () {
      }
    })
  },
  minecoupons() {
    wx.navigateTo({
      url: '/pages/minecoupons/minecoupons'
    });
  },
  gotoOrder(event) {
    var index = event.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/order/order?index=' + index
    });
  },
  gotoAddress() {
    wx.navigateTo({
      url: '/pages/addresslist/addresslist'
    });
  },
  contract: function () {
    wx.makePhoneCall({
      phoneNumber: '13776293129'
    })
  },
  viewAllOrder() {
    wx.navigateTo({
      url: '/pages/order/order?id='
    });
  }
})