// pages/index/index.js
var utils = require('../../utils/util.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var tips = require('../../components/tips.js');
var indexService = require('../../service/index.service.js');
var qqmapsdk = undefined;
Page({
  //打电话
  callPhone: function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  //定位
  getCurrentAdress: function(){
    return new Promise((resolve,reject)=>{
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          resolve(res);
        },
        fail: function(){
          let res = {};
          res.msg = '定位失败';
          res.status = -1;
          reject(res);
        }
      })
    })
  },
  openLocaltion: function(){
    var that = this;
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              //获取
              wx.chooseLocation({
                success: function(res){
                  that.setData({
                    currentAddress: res.address
                  })
                  // that.loadActives(res.latitude, res.longitude);
                }
              })
            }
          })
        }else{
          wx.chooseLocation({
            success: function (res) {
              that.setData({
                currentAddress: res.address
              })
              // that.loadActives(res.latitude, res.longitude);
            }
          })
        }
      }
    })
  },
  loadActives: function (latitude,longitude){
    wx.showLoading({ title: '加载中' });    
    let currentCity = this.data.currentCity;
    indexService.api({
      url: 'order/recommendProduct',
      method: 'post',
      data: {
        "startCode": currentCity,
        "currentPage": this.data.currentPage,
        "pageSize": "10"
      }
    }).then((res)=>{
      if(res.code == 'B1000'){
        let _data = JSON.parse(res.data.data);
        let actives = [];
        if (_data.eventShopInfos.length > 2){
          actives = _data.eventShopInfos.slice(0,2);
        }else{
          actives = _data.eventShopInfos;
        }
        this.setData({
          activeList: actives,
          lineInfos: _data.recommendedShopInfos,
          currentCode: res.data.startCode
        })
        wx.setStorageSync('startCode', res.data.startCode);
        wx.setStorageSync('sAddress', this.data.currentCity);
      }
      wx.hideLoading(); 
    });
  },
  openSetting: function(){
    wx.openSetting({
      success: (res) => {
        this.getLocalAndInfos();
      }
    })
  },
  getLocalAndInfos: function(){
    var resPromise = this.getCurrentAdress();
    var that = this;
    resPromise.then((res) => {
      var latitude = res.latitude
      var longitude = res.longitude
      this.setData({
        latitude: latitude,
        longitude: longitude
      })
      /**
       * 将获取的经纬度 置换位具体地址 qqMapWX.JS
       */
      // tips.show(that, JSON.stringify(qqmapsdk), 50000);
      qqmapsdk = new QQMapWX({
        key: 'THQBZ-5VRWG-4H3QF-IF7XQ-T2AKS-KFBDI'
      });
      qqmapsdk.reverseGeocoder({
        location: {
          latitude,
          longitude
        },
        success: function (res) {
          let currentCity = res.result.ad_info.city
          let address = res.result.address;
          let cCity = currentCity.substr(0, currentCity.length - 1);
          that.setData({
            isOpenLocaltion: true,
            currentAddress: address,
            currentCity: cCity
          })
          // that.loadActives(latitude, longitude);
        }
      });

    }).catch(error => {
      that.setData({
        isOpenLocaltion: false,
        currentAddress: '未开启定位',
        currentCity: ''
      })
    })
  },
  /**
   * 通用跳转
   */
  navToPath: function(e){
    let path = e.currentTarget.dataset.navUrl;
    let currentCompanyId = e.currentTarget.dataset.companyId
    if (path == '/pages/linesearch/linesearch'){
      path = '/pages/linesearch/linesearch';
    }
    if (path == '/pages/store/store'){
      path = '/pages/store/store?companyId=' + currentCompanyId
    }
    wx.navigateTo({
      url: path,
    })
  },
  getBanners: function(){
    indexService.getBannersApi({
      url: '/appversion/getAdPicByType?type=5'
    }).then((res)=>{
        console.log(res.data);
        this.setData({
          bannerList: res.data
        })
    })
  },
  getProductByShopId: function(){
    indexService.getProductByShopId({
      url: '/product/searchProductByShopId'
    }).then((res) => {
      console.log(res);
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    currentAddress: '',
    currentCity: '',
    latitude: '',
    longitude: '',
    isOpenLocaltion: true,
    activeList: [],
    lineInfos: [],
    bannerList: [],
    currentCode: '',
    currentPage: '1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getBanners();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      this.getLocalAndInfos();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    utils.getDeviceInfo().then((res) => {
      this.setData({
        windowHeight: getApp().globalData.deviceInfo.windowHeight
      })
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
    console.log('加载更多...');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})