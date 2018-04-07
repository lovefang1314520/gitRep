var config = require("../config/config.js");
var accountService = require("../service/account.service.js");
var wechatService = require("../service/wechat.service.js");
var resData = {};
var openid = wx.getStorageSync("openid");
function setUser(app,userInfo){


}
var login = {
  loginResponders: [],
  login: function (app) {
    var jsCodeDone;
    var self = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          wechatService
            .api({
              url: "login",
              data: { code: res.code }
            })
            .then((res) => {
              if(res && res.data){
                openid = res.data.openid;
                wx.setStorageSync('openid', res.data.openid);
              } 
            })
            .then(() => { 
              
            })
        } else {
            
        }
      }
    });
  },

  logout: function () {

  },
  isGetUserInfo(app, resolve, reject) {
    var self = this;
    app.globalData = app.globalData|| {};
    if (!openid){
      
    }else{
    accountService
      .api({
        url: "is-user-exist",
        method: "post",
        data: {
          userInfo: resData.userInfo,
          openid: openid
        }
      })
      .then((res) => {
        const userInfo = res.userinfo;
        if (res.code) {
          userInfo.openid = openid;
          app.globalData={
            ...app.globalData,
            userInfo: {
              memberAmount: userInfo.memberAmount,
              avatarUrl: userInfo.thumbnail,
              nickName: userInfo.nickname,
              gender: userInfo.sex,
              _id: userInfo._id,
              isBuy: userInfo.isBuy
            }
          }
          
          app.userInfoReadyState = true;
           wx.setStorageSync('userId', userInfo._id);
          resolve();
        } else {
          app.userInfoReadyState = false;
          reject(res);
          self.getUserInfo(app);
          
        }
      }).then(() => {
        resolve();
      })
    }
  },
  setUserInfo(app) {
    var self = this;
    const openid = wx.getStorageSync("openid");
    wx.request({
      url: config.api.setWeAppUser,
      data: {
        userInfo: resData.userInfo,
        openid: openid
      },
      header: {
        'content-type': 'application/json'
      },
      method: "POST",
      success: function (res) {
        const userInfo = res.data;
        app.globalData = {
          ...app.globalData,
          userInfo: {
            memberAmount: userInfo.memberAmount,
            avatarUrl: userInfo.thumbnail,
            nickName: userInfo.nickname,
            gender: userInfo.sex,
            _id: userInfo._id,
            isBuy: userInfo.isBuy
          }
        }
        wx.setStorageSync('userId', userInfo._id);
      }
    });

  },
  getUserInfo(app) {
    var self = this;
    wx.getUserInfo({
      success: function (res) {
        resData = res;
        app.globalData = {
          ...app.globalData,
          ...resData
        };
        self.setUserInfo(app);
      },
      fail: function (data) {
        app.appAuth = false;
        wx.showModal({
          title: '提醒',
          content: '取消授权，会影响您的付款，请你到小程序设置中修改授权信息',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: (res2) => {
                  if (!res2.authSetting['scope.userInfo']) {
                    wx.authorize({
                      scope: 'scope.userInfo',
                      success() {
                        wx.getUserInfo()
                      }
                    })
                  }
                }
              })
            } else if (res.cancel) {
             
            }
          }
        })
      }
    });
  }
}

module.exports = login;