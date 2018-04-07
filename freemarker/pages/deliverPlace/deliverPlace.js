// pages/deliverPlace/deliverPlace.js

var config = require('../../config/config.js');
var tips = require('../../components/tips.js');
var addrService = require('../../service/addr.service.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData:[]
  },
  chooseAddr: function (e) {
    let { item, id } = e.currentTarget.dataset;
    let {source,type} = this.data;
    if (source){
      wx.setStorageSync(type, JSON.stringify(item));
      wx.navigateTo({
        url: '/pages/writeorder/writeorder?type=' + type
      })
    }
    
  
  },
  edit: function (e) {
    let {item} = e.currentTarget.dataset;
    let { type } = this.data;
    wx.navigateTo({
      url: '/pages/addDeliver/addDeliver?source='+ JSON.stringify(item) +'&type='+type
    })
  },
  del: function (e) {
    var id = e.currentTarget.dataset.id;
    let { listData } = this.data;
    var that = this;
    wx.showModal({
      title: '',
      content: '是否要删除该联系人？',
      confirmColor: '#0faeff',
      success: (res)=> {
        if (res.confirm) {
          addrService.api({
            url: '/delUsedAddress',
            params: {
              'data': `{
                "body": '{"id": ${id} }',
                "header": '{}'
              }`
            }
          }).then((res) => {
            if (res.header && res.header.code == '10000') {
              tips.show(this, '删除成功', 1000);
              let { index } = listData.find((item, index) => { if (item.id == id) { item.index = index; return item } });
              listData.splice(index, 1);
              that.setData({
                listData
              });
            }
          });
        };
      }
    });
  },
  addAddr: function () {
    let { type } = this.data;
    wx.navigateTo({
      url: '/pages/addDeliver/addDeliver?type='+type
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ...options
    });
    var telephone = wx.getStorageSync('userPhone');
    // var telephone = '18887700001';
    addrService.api({
      url:'/getUsedAddress',
      params:{
        'data':`{
          "body": '{"userPhone": ${telephone} }',
          "header": '{}'
        }`
      }
    }).then((res) => {
      let { type } = this.data;
      if (type == 'sendAddress'){
        var data = res.body.sendAddress;
      }else{
        var data = res.body.receiveAddress;
      }
      this.setData({
        listData: data
      })
    });
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
    let { type } = this.data;
    var pageType = '常用收货地';
    if (type == 'sendAddress'){
      pageType = '常用发货地';
    }
    wx.setNavigationBarTitle({
      title: pageType
    });
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f9f9f9',
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