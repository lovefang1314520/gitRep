// pages/addDeliver/addDeliver.js
var tips = require('../../components/tips.js');
var config = require('../../config/config.js');
var addrService = require('../../service/addr.service.js');

var tcityService = require("../../service/threelinkage.service.js");

var app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    tel: '',
    other: '',
    provinceS:'',
    cityS:'',
    areaS:'',
    userPhone:"",

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
  saveS: function () {
    let { name, tel, other, provinceS, cityS, areaS, id, userPhone, currentAddress, countyCode} = this.data;
    if (name.length == 0) {
      tips.show(this, '请输入收货人姓名', 3000);
      return;
    }
    if (!(/^1[34578]\d{9}$/.test(tel))){
      tips.show(this, '手机格式不正确', 3000);
        return;
    };
    if (!currentAddress) {
      tips.show(this, '请选择省市区', 3000);
      return;
    }
    if (other.length == 0) {
      tips.show(this, '请输入详细地址', 3000);
      return;
    }
    let { type } = this.data;
    var typeData = '2';
    if (type =='sendAddress'){
      typeData = '1';
    }

    let sendData =JSON.stringify({
      [type]:{
        area: areaS,
        city: cityS,
        name,
        other,
        province: provinceS,
        tel,
        id,
        isDefault:'0',
        type: typeData,
        userPhone,
        addressCode:countyCode
      }
    });
    addrService.api({
      url: "/addUsedAddress",
      params: {
        'data': `{
          "body":${sendData} ,
          "header": '{}'
        }`

      },
    }).then((res) => {
      if (res.header && res.header.code == '10000'){
        tips.show(this, '保存成功', 3000);
        wx.navigateTo({
          url: '/pages/deliverPlace/deliverPlace?type=' + type
        })
      }else{
        tips.show(this, '保存失败', 3000);
      }
      
    });
  },
  bindinput: function(e){
    let { name } = e.target.dataset;
    this.setData({
      [name]: e.detail.value
    });
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
    if (options.source){
      var source = JSON.parse(options.source);
      debugger;
      if (source.addressCode){
        this.setData({
          ...source,
          provinceS: source.province,
          cityS: source.city,
          areaS: source.area,
          currentAddress: source.province + source.city + source.area,
          currentCode: source.addressCode,
        });
      }else{
        this.setData({
          ...source
        });
      }
    }
    this.setData({
      type: options.type,
      userPhone: wx.getStorageSync('userPhone')
    });
    

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
    let { type } = this.data;
    var pageType = '新增收货人地址';
    if (type == 'sendAddress') {
      pageType = '新增发货人地址';
      this.setData({
        type:"sendAddress"
      })
    }else{
      this.setData({
        type: "receiveAddress"
      })
    }
    wx.setNavigationBarTitle({
      title: pageType
    })
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