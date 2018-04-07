// pages/abountUS/abountUS.js
var app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  goKnowUS(){
    wx.navigateTo({
      url: '/pages/knowUS/knowUS',
    })
  },
  goJionUS() {
    wx.navigateTo({
      url: '/pages/jionUS/jionUS'
    })
  },
  goShare() {
    wx.navigateTo({
      url: '/pages/share/share'
    })
  },
  contactService() {
    wx.showModal({
      title: '',
      content: '电话： 4001-816-816',
      confirmText: '呼叫',
      success: (res)=>{
        if(res.confirm){

        }
      }

    })
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '关于我们'
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