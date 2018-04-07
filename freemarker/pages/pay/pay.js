// pages/pay/pay.js
let commonBackEndService = require("../../service/commonBackend.service.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ...getApp().selectCouponInfo,
    order: {}
  },
  jiedong() {
    let { selectCouponInfo ={}} = getApp();
    let { couponId, couponAmount } =selectCouponInfo;
    commonBackEndService.api({
      method: "post",
      url: "/kxtx-mhyq/miniapp/coupon/thaw",
      fromH5: false,
      params:{
        id: couponId
      }
    }).then((res) => {

    })
  },
  commonOrder() {
    let { order } = this.data;
    let { selectCouponInfo = {} } = getApp();
    let { couponId, couponAmount } = selectCouponInfo;
    return commonBackEndService.api({
      apiPrefix: "SWKPAY",
      method: "post",
      url: "/v300/wallet/weixinPay/getWeiXinOutTradeNo?fromH5=1",
      fromH5: true,
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
     
      data: {
       
        "data": JSON.stringify({
          'fromH5': 1,
          'body':{
            payerOrgOrVipId: wx.getStorageSync('userId'),
            optOrgOrVipId: wx.getStorageSync('userId'),//操作人id
            optOrgOrVipName: wx.getStorageSync('userPhone'),//操作人姓名                     
            optPhoneNum: wx.getStorageSync('userPhone'),//操作人手机
            orderId:order.waybillId,  //运单id
            orderNo: order.waybillNo,  //运单号
            orderType: 10,  //业务类型10-小程序支付
            openid: wx.getStorageSync('openid'),
            couponId: couponId, //优惠券id
            couponMoney: couponAmount, //优惠券金额
            oriBillId: order.orderId,//订单id
            oriBillNo: order.orderNo,//订单号
            remark: "",//
            totalMoney: order.totalFee
          },
          "header": {
            "phoneNum": wx.getStorageSync('userPhone'),
            "userType": "1" //0-成员 1-会员
          }
        }
        )
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let { order = "{}" } = options;
    order = JSON.parse(order);
    this.setData({
      ...getApp().selectCouponInfo,
      order: getApp().payOrder|| order
    },()=>{
      getApp().payOrder= this.data.order;
      
    });
    
  },
  gotoCoupon() {
    wx.navigateTo({
      url: '/pages/preference/preference?hasSource=true&totalPrice=100',
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
      title: "付款"
    });
  },

  getWeiXinPay(params) {
    var that = this;
    wx.requestPayment(
      {
        ...params,
        'signType': 'MD5',
        'paySign': params.paySign,
        'success': function (res2) {

        },
        'fail': function (res) {

          tips.show(that, '支付失败', 500);

        }
      })



  },
  rightPay() {
    this.commonOrder().then((res) => {
      if(res.header.code==='10000'){
        this.getWeiXinPay();
      }else{
        wx.redirectTo({
          url: '/pages/submitorderresult/submitorderresult?result=paysuccess',
        })
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