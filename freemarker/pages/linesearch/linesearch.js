// pages/linesearch/linesearch.js
//var tcity = require("../../utils/citys.js");
var tcityService = require("../../service/threelinkage.service.js");
var lineService = require("../../service/linesearch.service.js");
Page({
  /**
   * 通用跳转
   */
  navToPath: function (e) {
    let path = e.currentTarget.dataset.navUrl;
    wx.navigateTo({
      url: path,
    })
    getApp().globalData.orderSource = 'linesearch';
  },
  
  changeAddress: function(e){
    let _data = e.currentTarget.dataset;
    let satrtAddress = _data.start;
    let endAddress = _data.end;
    let sCode = _data.scode;
    let eCode = _data.ecode;
    this.setData({
      startAddress: satrtAddress,
      endAddress: endAddress,
      startCode: sCode,
      endCode: eCode,
    })
  },

  search: function(){
    let sAddr = this.data.startAddress;
    let eAddr = this.data.endAddress;
    let startCode = this.data.startCode;
    let endCode = this.data.endCode;
    if (sAddr && eAddr){
      if (!getApp().isLogin) {
        getApp().loginForm = 'linesearch';
        wx.navigateTo({
          url: '/pages/login/login?',
        })
        return;
      }
      let lineHistory = JSON.parse(wx.getStorageSync('lineHistoryList') || JSON.stringify([]));
      let obj = {
        sAddress: sAddr,
        sCode: startCode,
        eAddress: eAddr,
        eCode: endCode
      };
      if (lineHistory.length > 0 && lineHistory.length < 11){
        let cf = false;
        for (let lhObj of lineHistory){
          if (lhObj.sCode == obj.sCode && lhObj.eCode == obj.eCode){
            cf = true;
          }
        }
        if (!cf){
          lineHistory.push(obj);          
        }
        //lineHistory = [...new Set(lineHistory)];
      } else if (lineHistory.length == 0){
        lineHistory.push(obj);
      }else{
        lineHistory.shift(); 
        lineHistory.push(obj);
      }
      wx.setStorageSync('lineHistoryList', JSON.stringify(lineHistory));
      console.log('/pages/searchinfo/searchinfo?sAddr=' + sAddr + '&eAddr=' + eAddr + '&sCode=' + startCode + '&eCode=' + endCode);
      wx.navigateTo({
        url: '/pages/searchinfo/searchinfo?sAddr=' + sAddr + '&eAddr=' + eAddr + '&sCode=' + startCode + '&eCode=' + endCode,
      })
    }
  },
  clearStorage: function(){
    try {
      wx.removeStorageSync('lineHistoryList')
      this.setData({
        lineHistory: []
      })
    } catch (e) {
      // Do something when catch error
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    startAddress: '',
    endAddress: '',
    startCode: '',
    endCode: '',
    //cityData: cityData,
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    countyCode: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    isStartCity: true,
    lineHistory : []
  },
  bindChange: function (e) {
    //console.log(e);
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;
    if (val[0] != t[0]) {
      console.log('province no ');
      // const citys = [];
      // const countys = [];
      const initProv = this.data.provinces[val[0]];

      const citys = Object.keys(cityData[initProv].city);
      const initCity = citys[0];

      const countys = Object.keys(cityData[initProv].city[initCity].area);
      const initCounty = countys[0];

      const countyCode = cityData[initProv].city[initCity].area[initCounty].id;

      // for (let i = 0; i < cityData[val[0]].sub.length; i++) {
      //   citys.push(cityData[val[0]].sub[i].name)
      // }
      // for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
      //   countys.push(cityData[val[0]].sub[0].sub[i].name)
      // }

      this.setData({
        province: initProv,
        city: initCity,
        citys: citys,
        county: initCounty,
        countys: countys,
        values: val,
        value: [val[0], 0, 0],
        countyCode: countyCode        
      })

      return;
    }
    if (val[1] != t[1]) {
      console.log('city no');

      // const countys = [];

      // for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
      //   countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      // }
      const initProv = this.data.province;
      const initCity = this.data.citys[val[1]];

      const countys = Object.keys(cityData[initProv].city[initCity].area);
      const initCounty = countys[0];

      const countyCode = cityData[initProv].city[initCity].area[initCounty].id;

      this.setData({
        city: initCity,
        county: initCounty,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0],
        countyCode: countyCode
      })
      return;
    }
    if (val[2] != t[2]) {
      console.log('county no');
      const initProv = this.data.province;
      const initCity = this.data.city;
      const initCounty = this.data.countys[val[2]];
      const countyCode = cityData[initProv].city[initCity].area[initCounty].id;
      this.setData({
        county: this.data.countys[val[2]],
        values: val,
        countyCode: countyCode
      })
      return;
    }
  },
  open: function (e) {
    let addrFlag = e.currentTarget.dataset.addr;
    if (addrFlag){
      this.setData({
        condition: !this.data.condition,
        isStartCity: true
      })
    }else{
      this.setData({
        condition: !this.data.condition,
        isStartCity: false
      })
      console.log(addrFlag, addrFlag);
    }
  },
  save: function(){
    console.log(this.data.isStartCity);
    let _data = this.data;
    let currentAddress = _data.province + _data.city + _data.county;
    if (this.data.isStartCity){
      this.setData({
        startAddress: currentAddress,
        condition: !this.data.condition,
        startCode: this.data.countyCode
      })
    }else{
      this.setData({
        endAddress: currentAddress,
        condition: !this.data.condition,
        endCode: this.data.countyCode
      })
    }
  },
  cancle: function(){
    this.setData({
      condition: !this.data.condition
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad");
    var that = this;

    tcityService.api({
      url: "/sysOper/config/getAddressData"
    }).then((res)=>{
      if(res.header.code == 10000){
        let cityData = res.body;
        that.setData({
          cityData: cityData
        })
        const provinces = Object.keys(cityData) || [];
        const initProv = provinces[0];

        const citys = Object.keys(cityData[initProv].city);
        const initCity = citys[0];
        
        const countys = Object.keys(cityData[initProv].city[initCity].area);
        const initCounty = countys[0];
        const countyCode = cityData[initProv].city[initCity].area[initCounty].id;

        that.setData({
          'provinces': provinces,
          'citys': citys,
          'countys': countys,
          'province': initProv,
          'city': initCity,
          'county': initCounty,
          'countyCode': countyCode,
          'startCode': options.sAddr || wx.getStorageSync('startCode') || '',
          'startAddress': options.sCode || wx.getStorageSync('sAddress') || '',
          'endAddress': options.eAddr || '',
          'endCode': options.eCode || ''
        })
        console.log('初始化完成');
      }
    })

    // tcity.init(that);
    // var cityData = that.data.cityData;
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
    try {
      var value = wx.getStorageSync('lineHistoryList')
      if (value) {
        this.setData({
          lineHistory: JSON.parse(value)
        })
        console.log(this.data.lineHistory);
      }
    } catch (e) {
      // Do something when catch error
    }
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