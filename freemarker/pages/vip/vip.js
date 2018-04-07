// pages/vip/vip.js
let commonBackEndService = require("../../service/commonBackend.service.js");
var config = require('../../config/config.js');
var tips = require('../../components/tips.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: app.isLogin
  },
  goDeliverPlace: function(){
    wx.navigateTo({
      url: '/pages/deliverPlace/deliverPlace?type=sendAddress'
    })
  },
  goReceiptPlace: function () {
    wx.navigateTo({
      url: '/pages/deliverPlace/deliverPlace?type=receiveAddress'
    })
  },
  goDiscount: function () {
    wx.navigateTo({
      url: '/pages/preference/preference'
    })
  },
  goAbountUS: function () {
    // wx.navigateTo({
    //   url: '/pages/abountUS/abountUS'
    // })
  },
  goLogin: function(){
    app.loginFrom = 'vip';
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    commonBackEndService.api({
      url: "coupon/couponQuery",
      method: "post",
      data: {
        ownnerId: wx.getStorageSync("userId"),
        statuses: ['1', '2']
      }
    }).then((res) => {
      if (res.data) {
        this.setData({
          couponsCount: res.data.length
        })
      } else {
        this.setData({
          couponsCount: 0
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: "我的"
    });
    this.setData({
      isLogin: app.isLogin,
      tel: wx.getStorageSync('userPhone')
    });
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff8400',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})