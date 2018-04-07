// pages/jionUS/jionUS.js
var tcityService = require("../../service/threelinkage.service.js");


Page({

  /**
   * 页面的初始数据
   */
  data: {
    showButton: [false,false,false],


    currentAddress: '',
    currentCode: '',
    endAddress: '',
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    countyCode: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false
  },
  /**
   * 选择radio
   */
  checkClick: function(e){
    var index = e.currentTarget.dataset.index;
    let {showButton} = this.data;
    showButton[index] = !showButton[index];
    this.setData({
      showButton
    })
  },
  contact: function(e){
    wx.showModal({
      title: '',
      content: '电话： 13523455432',
      confirmText: '呼叫',
      success: (res) => {
        if (res.confirm) {

        }
      }
    })
  },

  /**
   * 地址控件
   */
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
    this.setData({
      condition: !this.data.condition,
    })
  },
  save: function () {
    let _data = this.data;
    let currentAddress = _data.province + _data.city + _data.county;

    this.setData({
      currentAddress: currentAddress,
      provinceS: _data.province,
      cityS: _data.city,
      areaS: _data.county,
      condition: !this.data.condition,
      currentCode: this.data.countyCode
    })
  },
  cancle: function () {
    this.setData({
      condition: !this.data.condition
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    tcityService.api({
      url: "/sysOper/config/getAddressData"
    }).then((res) => {
      if (res.header.code == 10000) {
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
      title: '加盟我们'
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