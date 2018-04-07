var config = require('../../config/config.js');
var app = getApp();
module.exports = {
   receiveCoupon(couponIds,many=false){
     return new Promise((reslove, reject) => {
       wx.request({
         url: config.api.getCoupons,
         method: "post",
         data:{
           user: wx.getStorageSync('userId'),
           coupon: couponIds,
           many
         },
         complete: function (res) {

         },
         success: function (res) {
           if (res.errMsg == "request:ok") {
             reslove(res.data)
           } else {
             reject(res);
           }
         }
       });
     })
   },
   getMyCoupons:(params)=>{
      return new Promise((reslove,reject)=>{
        wx.request({
          url: config.api.getCoupons+'?status=normal',
          method: "get",
          data: { ...params, user: wx.getStorageSync('userId')},
          complete: function (res) {
              
          },
          success: function (res) {
            if (res.errMsg == "request:ok") {
              reslove(res.data)
            }else{
              reject(res);
            }
          }
        });
      })
   }
}