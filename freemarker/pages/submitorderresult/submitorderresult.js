// pages/submitorderresult/submitorderresult.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result:"success"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function (options) {
    let { result } = options;
    this.setData({
      result
    })
  },
  gotoOrderList(){
    wx.switchTab({
      url: '/pages/orderlist/orderlist'
    })
  },
  rePay() {
    wx.redirectTo({
    
    
      url: '/pages/pay/pay'
    })
  },
  reSubmit(){
    wx.redirectTo({
      url: '/pages/writeorder/writeorder'
    })
  },
  gotoIndex(){
    wx.switchTab({
      url: '/pages/index/index'
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
      title: "提交结果"
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