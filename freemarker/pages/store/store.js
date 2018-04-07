// pages/store/store.js
let storeService = require('../../service/store.service.js');
Page({
  //打电话
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  /**
     * 通用跳转
     */
  navToPath: function (e) {
    let path = e.currentTarget.dataset.navUrl;
    let formPath = e.currentTarget.dataset.formUrl;
    let orderObj = e.currentTarget.dataset.orderObj;
    wx.navigateTo({
      url: path,
    })
    getApp().orderObj = orderObj;
    getApp().globalData.orderSource = formPath + 'companyId=' + this.data.companyId;
  },
  /**
   * 页面的初始数据
   */
  data: {
    storeInfos : {},
    lineCompanyList: [],
    features: [],
    companyId: '',
    currentPage: '1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProductInfo(options);
  },

  getProductInfo: function(options){
    storeService.api({
      url: '/product/searchProductByShopId',
      method: 'post',
      data: {
        "companyId": options.companyId,
        "page": this.data.currentPage,
        "pageSize": 10,
        "productStatus": 2
      }
    }).then((res) => {
      if (res.code == 'B1000') {
        let _data = res.data;
        let features = _data.storeInfo.feature.split(',');
        this.setData({
          storeInfos: _data.storeInfo,
          lineCompanyList: _data.productInfo.records,
          features: features,
          companyId: options.companyId
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