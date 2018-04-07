// pages/ordersearch/ordersearch.js
var utils = require('../../utils/util.js');
var orderService = require('../../service/order.service.js');
var tips = require('../../components/tips.js');
let config = require("../../config/config.js");
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    history: [],
    orderStatusDict: config.dict.orderStatus,
    orders: [],
    historyShow:true
  },
  getOrderList() {
    let { keywords } = this.data;
    app.keywords = keywords;
    wx.switchTab({
      url: '/pages/orderlist/orderlist',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('history')){//获取历史记录
      this.setData({
        history: JSON.parse(wx.getStorageSync('history'))
      })
    }else{
      this.setData({
        history:[]
      })
    }
  },
  bindinput(e) {//输入
    console.log(e.detail.value);
    this.setData({
      keywords: e.detail.value,
      historyShow: true
    })
  },
  gotoOrderSearch(e){//点击查询
    let { type } = e.target.dataset;
    let { keywords} = this.data;
    if(type !='input'){
      if (!keywords) {
        tips.show(this, '请输入运单或订单号', 3000);
        return;
      }
      let { history } = this.data;
      var pushFlg = true;
      if (history.length!=0){
        for (var item of history){
          if (keywords == item) {
            pushFlg = false;
          } 
        }
      }
      if (pushFlg) {
        history.unshift(keywords);
      }
      wx.setStorageSync('history', JSON.stringify(history));
      this.setData({
        historyShow: false
      })
      this.getOrderList();
    }
  },
  setKeyWord(event) {//点击历史记录
    let { item } = event.target.dataset;
    this.setData({
      keywords: item,
      historyShow: false
    });
  },
  scanOrder() {//扫描
    let that = this;
    wx.scanCode({
      success: (res) => {
        that.setData({
          keywords: res.result
        })
        // this.getOrderList();
        tips.show(that, JSON.stringify(res.result), 50000);
      }
    })
  },
  clear() {//清除历史记录
    let that = this;
    wx.showModal({
      content: '是否删除全部记录',
      success: function (res) {
        if (res.confirm) {
          that.setData({
            historyShow: false,
            history: ''
          })
          wx.setStorageSync('history', '');
          tips.show(that, '清除成功', 3000);
        }
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
      title: "单号查询"
    });
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f5f5f5',
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