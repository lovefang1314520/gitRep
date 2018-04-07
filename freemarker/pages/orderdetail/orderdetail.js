// pages/orderdetail/orderdetail.js
var utils = require('../../utils/util.js');
var orderService = require('../../service/order.service.js');
let config = require("../../config/config.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderStatus: config.dict.orderStatus,
    specialCargoType: config.dict.GOODS_TYPE,
    backSignbillType: config.dict.RECEIPT_TYPES,
    settleType: config.dict.SETTLE_TYPE,
    orderData:{},
    oldOrder: {},//支付状态、订单状态以oldOrder为准
    discount: 0
  },
  logisticsTrack() {
    let { waybillId='', orderNo, sendNetworkName, orderStatus } = this.data.orderData;
    wx.navigateTo({
      url: '/pages/logisticstrack/logisticstrack?waybillId=' + waybillId + '&orderNo=' + orderNo + '&sendNetworkName=' + sendNetworkName + '&orderStatus=' + orderStatus
    })

  },  
  getDetails:function(){//获取数据
  let {orderNo} = this.data;
    orderService.api({
      url: '/searchOrderInfoById',
      params: {
        orderNo
      }
    }).then((res) => {
      wx.hideLoading();
      if (res && res.data && res.data.data) {
        let source = res.data.data.oldOrder;
        if (res.data.data.newOrder){//修改过订单，订单信息已新的订单信息为准
          source = res.data.data.newOrder;
        }
        this.setData({
          orderData: source,
          oldOrder: res.data.data.oldOrder,
          discount: res.data.data.offerAmount
        });
      } else {
        this.setData({
          orderData: {},
          oldOrder: {}
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ...options
    });
    wx.showLoading({
      title: '加载中',
    });
    this.getDetails();
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