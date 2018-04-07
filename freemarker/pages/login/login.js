// pages/login/login.js

var tips = require('../../components/tips.js');
var config = require('../../config/config.js');
var loginService = require('../../service/login.service.js');
var app = getApp();
let interal =0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maxCount: 60,
    isChecked: true,
    vetifyFlg: false,
    showCloseButton: false,
    telephone: '',
    code: '',
    telFlg: false,
    codeFlg: false,
    getCodeText: '获取验证码',
    getCodeFlg: true
  },
  /**
   * 同意协议
   */
  checkClick: function (e) {
    var checked = JSON.parse(e.currentTarget.dataset.checked);
    this.setData({
      isChecked: !checked
    })
  },
  /**
   * closeButton
   */
  getRegCode() {
    let { getCodeText, getCodeFlg, maxCount, telFlg } = this.data;
    if (getCodeFlg && telFlg) {
      clearInterval(interal);
      getCodeFlg = false;
      this.setData({
        getCodeFlg
      },()=>{
        this.sendMessage();
      });
      interal = setInterval(() => {
        maxCount = this.data.maxCount;
        maxCount--;
        if (maxCount > 0) {
          this.setData({
            maxCount
          })
        } else {
          clearInterval(interal);
          this.setData({
            getCodeFlg: true,
            maxCount: 60,
            getCodeText: '重新发送'
          })
        }
      }, 1000)
    }
  },
  bindinput(event) {
    let { name } = event.target.dataset;
    let { telephone, code } = this.data;
    this.setData({
      [name]: event.detail.value
    }, () => {
      let { telephone, code } = this.data;
      if ((/^1[34578]\d{9}$/.test(telephone))) {
        this.setData({
          telFlg: true
        })
      } else {
        this.setData({
          telFlg: false
        })
      }
      if (code.length == 6) {
        this.setData({
          codeFlg: true
        })
      } else {
        this.setData({
          codeFlg: false
        })
      }
    });
  },
  mobileFocus: function (e) {
    this.setData({
      showCloseButton: true
    })
  },
  mobileBlur: function (e) {
    this.setData({
      showCloseButton: false
    })
  },
  resetMobile: function (e) {
    this.setData({
      telephone: ''
    })
  },
  goRegisterText: function () {
    // wx.navigateTo({
    //   url: '/pages/registerText/registerText'
    // })
  },
  goShouquanText: function () {
    wx.navigateTo({
      url: '/pages/shouquanText/shouquanText'
    })
  }, 
  sendMessage(){
    let { telephone } = this.data;
    loginService.api({
      url:"/sendVerifyCode",
      method: "post",
      data: {
        phoneNum: telephone
      }
    }).then((res) => {
      tips.show(this, res.data, 5000);
      console.log(res);
    })
  },
  formSubmit: function (e) {
    this.loginIn(e.detail.formId);
  },
  loginIn: function (formId) {
    let {telephone,code} = this.data;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    
    loginService.api({
      url:"/userRegister",
      method:"post",
      data:{
        phoneNum: telephone,
        openId: wx.getStorageSync('openid'),
        verifyCode: code,
        formId
      }
    }).then((res)=>{
      wx.hideLoading();
      if(res && res.data && res.data.success){
        tips.show(this, '登录成功', 1000);
        app.isLogin = true;
        wx.setStorageSync('isLogin', true);
        wx.setStorageSync('userId', res.data.userId);
        wx.setStorageSync('userPhone', telephone);
        if (res.data.companyId){
          wx.setStorageSync('companyId', res.data.companyId);
        }
        res.data.orgId = res.data.orgId || res.data.userId;
        wx.setStorageSync('orgId', res.data.orgId);
        var {loginFrom ='vip'} = app;
        if (loginFrom) {
          if (loginFrom == 'vip' || loginFrom == 'orderlist' || loginFrom == 'index') {
            wx.switchTab({
              url: `/pages/${loginFrom}/${loginFrom}`
            });
          } else {
            wx.redirectTo({
              url: `/pages/${loginFrom}/${loginFrom}`
            });
          }
        }
      }else{
        tips.show(this, '手机或验证码不正确', 3000);
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
      title: "登录"
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