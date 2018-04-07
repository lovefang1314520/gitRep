// pages/searchinfo/searchinfo.js
var lineService = require("../../service/linesearch.service.js");
Page({
  /**
     * 通用跳转
     */
  navToPath: function (e) {
    let path = e.currentTarget.dataset.navUrl;
    let formPath = e.currentTarget.dataset.formUrl;
    let orderObj = e.currentTarget.dataset.orderObj;
    //console.log(path + '?orderObj=' + orderObj);
    wx.navigateTo({
      url: path
    })
    getApp().globalData.orderSource = `${formPath}sAddr=${this.data.startAddress}&eAddr=${this.data.endAddress}&sCode=${this.data.startCode}&eCode=${this.data.endCode}&companyId=${this.data.companyId}`;
    getApp().orderObj = orderObj;
  },
  /**
   * 页面的初始数据
   */
  data: {
    startAddress: '',
    endAddress: '',
    startCode: '',
    endCode: '',
    companyId: wx.getStorageSync('companyId') || '',
    lineResult: [],
    currentPage: '1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    wx.setNavigationBarTitle({
      title: options.sAddr + '-' + options.eAddr,
    })
    this.setData({
      startAddress: options.sAddr,
      endAddress: options.eAddr,
      startCode: options.sCode,
      endCode: options.eCode,
    });
    
    this.getProductList(options);
    
  },

  getProductList: function (options){
    lineService.api({
      url: 'product/searchProductByStartAndEndAddrCode',
      method: 'post',
      data: {
        "startStationCode": options.sCode,
        "endStationCode": options.eCode,
        "companyId": this.data.companyId || '',
        "isAllProvince": false,
        "page": this.data.currentPage,
        "pageSize": 10
      }
    }).then((res) => {
      if (res.data && res.data.totalRecord > 0) {
        this.setData({
          lineResult: res.data.records,

        })
      } else {
        this.setData({
          lineResult: []
        })
      }
      console.log(this.data.lineResult);
      wx.hideLoading();
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