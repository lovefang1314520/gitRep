// pages/invalidateCoupon/invalidateCoupon.js
let commonBackEndService = require("../../service/commonBackend.service.js");
var config = require('../../config/config.js');
var utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponStatus: config.dict.COUPON_STATUS,
    couponType: config.dict.COUPON_TYPE
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
        statuses: ['7']
      }
    }).then((res) => {
      if (res.data) {
        res.data = (res.data).map((item) => { item.endTime = utils.formatTime(item.endTime, '.'); return item });
        this.setData({
          coupons: res.data
        })
      }else{
        this.setData({
          coupons: []
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