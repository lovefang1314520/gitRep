let config = require("../../config/config.js");
var utils = require('../../utils/util.js');
var tips = require('../../components/tips.js');
let app = getApp();
let _value = "";
let params = {};
let commonBackEnd = require('../../service/commonBackend.service.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    deliverType: 2,
    saleout: false,
    isSubmiting: false,
    ...config.dict,
    showModal: false,
    windowHeight: 0,
    transportFee: 0,
    isPickup: true,
    deliveryType: true,
    hasHuiDanService: "",
    isShowNumberModal: false,
    backSignbillType: "无回单要求"
  },
  initOrderData() {
    let { declaredValue, packing, cargoName, totalNum, totalWeight, totalVolume, specialCargoType, backSignbillType, remark, productId, sendNetworkNo, sendNetworkName, providerName} = getApp().orderObj;
    if (productId){
      //, sendNetworkNo: startPointId, startPointId: startPointName
      getApp().orderObj.sourceId = productId;
      getApp().orderObj.startPointId = sendNetworkNo;
      getApp().orderObj.startPointName = sendNetworkName;
      getApp().orderObj.companyName = providerName;
      
    //  sendNetworkNo
  }
    let { RECEIPT_TYPES, GOODS_TYPE} = this.data;
    if (cargoName && totalWeight && totalVolume){
      app.goodsInfo = {
        declaredValue,
        select_GOODS_NAME: cargoName,
        specialCargoType: GOODS_TYPE[specialCargoType - 1],
        packing,
        cargoName: cargoName,
        totalNum: Number(totalNum),
        totalWeight: Number(totalWeight),
        totalVolume: Number(totalVolume)
      };
      
    }
    
    app.someWordInfo = {
      remark
    };
   
    this.setData({
      ...getApp().orderObj,
      specialCargoType: app.goodsInfo&&app.goodsInfo.specialCargoType,
      backSignbillType: RECEIPT_TYPES[backSignbillType - 1] || "无回单要求"
    })

  },
  switch1Change(e) {
    let {
     fieldname
   } = e.target.dataset
    if (fieldname == 'deliverType') {
      this.setData({
        [fieldname]: e.detail.value ? 2 : 1
      })
    } else {
      this.setData({
        [fieldname]: e.detail.value
      })
    }


  },
  submitOrder(e) {

    let { formId } = e.detail;
    let { transportFee, fahuo = {}, shouhuo = {}, backSignbillType, codValue, deliverType, specialCargoType, isPickup, isSubmiting, RECEIPT_TYPES = [], GOODS_TYPE = []} = this.data;
    let { goodsInfo = {}, orderObj = {} } = getApp();
     debugger;
    if (isSubmiting) {
      return;
    }
    if (!fahuo.consignerName) {
      tips.show(this, "请选择发货地址", 1000);
      return;
    }
    else if (!shouhuo.consigneeName) {
      tips.show(this, "请选择收货地址", 1000);
      return;
    }
    else if (Object.keys(goodsInfo).length == 0) {
      tips.show(this, "请选择货物信息", 1000);
      return;
    }
    else if (!backSignbillType) {
      tips.show(this, "请选择回单类型", 1000);
      return;
    }
    // else if (!codValue) {
    //  // tips.show(this, "请输入代收货款", 1000);
    //   return;
    // }
    wx.showLoading({ title: '下单中' });
    this.setData({
      isSubmiting: true
    })
    commonBackEnd.api({
      url: "/order/addOrder",
      method: "post",
      data: {
        ownerId: wx.getStorageSync("userId"),
        sourceId: orderObj.sourceId,
        companyCode: "WECHAT_KFPT",
        formId: "33344",
        routeId: orderObj.sourceId,
        codValue: Number(codValue),
        userId: wx.getStorageSync("userId"),
        createOrderType: "1",
        deliverType,
        productId: orderObj.sourceId,
        isPickup,
        codCharge: 0,
        deliveryFee: 0,
        timeLimit: 22,
        providerName: orderObj.companyName,
        transportFee,
        totalFee: transportFee,
        offerFee: 0,
        pickupFee: 0,
        smsFee: 0,
        payType: 1,
        quality: 1,
        firstReceiverPointId: orderObj.startPointId,
        sendNetworkNo: orderObj.startPointId,
        sendNetworkName: orderObj.startPointName,
        isSmsNotify: false,
        transTradeType: 2,
        backSignbillType: RECEIPT_TYPES.indexOf(backSignbillType) + 1,
        ...shouhuo,
        ...fahuo,
        orgId: wx.getStorageSync('orgId'),
        ...app.goodsInfo,
        specialCargoType: GOODS_TYPE.indexOf(specialCargoType) + 1,
        ownerName: wx.getStorageSync("userPhone"),
        settleType: 1,
        select_GOODS_NAME: undefined,
        ...app.someWordInfo
      }
    }).then((res) => {
      wx.hideLoading();
      this.setData({
        isSubmiting: false
      });
      if (!res.data) {
        tips.show(this, res.msg, 1000);
      }
      else if (res.data && res.data.success) {
        //tips.show(this, "下单成功！", 1000);
        wx.redirectTo({

          url: '/pages/submitorderresult/submitorderresult?result=success'
        })
        getApp().someWordInfo = {};
        getApp().goodsInfo = {};
      } else {
        //tips.show(this, "下单失败！", 1000);
        if (res.data.msg == '该产品未上架,请重新选择!') {
          this.setData({
            saleout: true
          })
        } else {
          wx.redirectTo({
            url: '/pages/submitorderresult/submitorderresult?result=fail'
          })
        }

      }

    })


  },
  isOutOfRange() {
    let { goodsInfo = {}, orderObj = {}, shouhuo } = getApp();
    let { startProvinceId, endProvinceId, startCityId, endCityId } = orderObj;
    if (shouhuo.cityId != startCityId) {
      tips.show(this, "不能超出产品范围", 1000);
      return false
    }
    if (orderObj.isCoverageProvince) {
      if (endProvinceId == shouhuo.provinceId) {
        return true
      } else {
        tips.show(this, "不能超出产品范围", 1000)
        return false
      }
    } else {
      if (endCityId == shouhuo.cityId) {
        return true
      } else {
        tips.show(this, "不能超出产品范围", 1000)
        return false
      }

    }


  },
  calYuguPrice() {
    let { goodsInfo = {}, orderObj = {} } = getApp();
    commonBackEnd.api({
      url: "product/calPrice",
      method: "post",
      data: {
        id: orderObj.sourceId || orderObj.productId,
        weight: goodsInfo.totalWeight,
        volumn: goodsInfo.totalVolume,
      }
    }).then((res) => {
      this.setData({
        transportFee: Number(res.data || 0).toFixed(2)
      })
    })
  },
  rechoose() {
    let { orderSource } = getApp().globalData;
    wx.navigateTo({
      url: orderSource
    })
  },
  openaddress(event) {
    let { type } = event.currentTarget.dataset;
    let _type = {
      "fahuo": "sendAddress",
      "shouhuo": "receiveAddress"
    }
    wx.navigateTo({
      url: '/pages/deliverPlace/deliverPlace?type=' + _type[type] + "&source=delivery",
    });
  },
  saveHuoKuan() {
    this.setData({
      isShowNumberModal: false,
      codValue: _value
    })

  },
  bindinput(event) {
    let { value } = event.detail;
    _value = value;
    this.setData({
      huokuanValue: value
    })
  },
  showNumberModal() {
    this.setData({
      isShowNumberModal: true
    })
  },
  closeNumberModal() {
    this.setData({
      isShowNumberModal: false
    })

  },
  gotoGoods() {
    wx.navigateTo({
      url: '/pages/goodsinfo/goodsinfo'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { type } = options;
    params = options;
    // if (type) {
    let shouhuo = JSON.parse(wx.getStorageSync('receiveAddress') || "{}");
    let fahuo = JSON.parse(wx.getStorageSync('sendAddress') || "{}")
    this.setData({
      fahuo: {
        consignerName: fahuo.name,
        consignerMobile: fahuo.tel,
        consignerProvince: fahuo.province,
        consignerCity: fahuo.city,
        consignerDistrict: fahuo.area,
        consignerAddr: fahuo.other
      },
      shouhuo: {
        consigneeName: shouhuo.name,
        consigneeMobile: shouhuo.tel,
        consigneeProvince: shouhuo.province,
        consigneeCity: shouhuo.city,
        consigneeDistrict: shouhuo.area,
        consigneeAddr: shouhuo.other
      }
    });
   
    this.initOrderData();
   
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
      title: "填写订单"
    });
    utils.getDeviceInfo().then((res) => {
      this.setData({
        windowHeight: getApp().globalData.deviceInfo.windowHeight
      })
    })
    let { goodsInfo = {} } = getApp();
    if (Object.keys(goodsInfo).length > 0) {
      this.calYuguPrice();
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
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  goToSomeWords() {
    wx.navigateTo({
      url: '/pages/somewords/somewords',
    })

  },
  bindPickerChange(event) {
    let { RECEIPT_TYPES } = this.data;

    this.setData({
      backSignbillType: RECEIPT_TYPES[event.detail.value]
    })
  },
  closeModal() {

  }

})