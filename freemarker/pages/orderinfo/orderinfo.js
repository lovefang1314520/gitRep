// pages/orderinfo/orderinfo.js
var config = require('../../config/config.js');
var utils = require('../../utils/util.js');
var orderService = require('../../service/order.service.js');
var loader = require('../../components/loader.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const ids = options.id;
    let that = this;
    loader.show(this);
    orderService
      .api({ url:"/"+ids})
    .then((res)=>{
      res = res[0];
      that.setData({
        ...res,
        status:config.dict.orderStatus1[res.status],
        date: utils.formatTime(res.date,'-','time')
      });
      loader.hide(that, 1);
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
      title: "我的订单"
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