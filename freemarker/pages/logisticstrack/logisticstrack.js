// pages/logisticstrack/logisticstrack.js
var utils = require('../../utils/util.js');
var orderService = require('../../service/order.service.js');
let config = require("../../config/config.js");
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusFilter: config.dict.orderStatus
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { waybillId, orderNo, sendNetworkName, orderStatus} = options;
    this.setData({
      ...options
    })
    
    orderService.apiSWKPAY({
      url: '/api/logistics/getLogisticsInfo',
      params: {
        'data': `{"body":{"billId":${waybillId},"billType":"3","orderNo":${orderNo},"orderType":"7","queryLevel":"4"},"header":{}}`
      }
    }).then((res) => {
      wx.hideLoading();
      if (res && res.body && res.body.fieldList) {
        this.setData({
          data: res.body.fieldList
        });
      } else {
        this.setData({
          data: []
        });
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
      title: "物流跟踪"
    });
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