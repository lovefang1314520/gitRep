// pages/somewords/somewords.js
let config = require("../../config/config.js");
var tips = require('../../components/tips.js');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    somewords: '',
    ...config.dict
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  bindinput(event){
   
    this.setData({
      somewords: event.detail.value.substring(0, 200)
    })
  },
  saveSomeWords(){
    let { somewords, activeitem} = this.data;
    if (!somewords){
       tips.show(this,"请输入",1000);
       return;
    }
    
    app.someWordInfo = {
      words: somewords,
      remark: activeitem
    };
    wx.navigateTo({
      url: '/pages/writeorder/writeorder'
    },(e)=>{
     console.log(e);
    })
  },
  setActiveItem(event){
    let { activeitem } = event.target.dataset;
     this.setData({
       activeitem
     })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: "捎一句话"
    });
    let { someWordInfo ={} } =getApp();
    debugger;
    this.setData({
      somewords: someWordInfo.words,
      activeitem: someWordInfo.remark
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
     wx.stopPullDownRefresh();
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