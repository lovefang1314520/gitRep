let utils = require("../utils/util.js");
const url = 'https://test-mhyq.kxtx.cn/kxtx-mhyq';
let formData;
const apiPrefixList = {
  MHYQ: url,
  MHYQMINIAPP: url + "/miniapp/",
  SWKPAY: "https://test-swk-pay.kxtx.cn/webapp"


};
const apiPrefix = url + '/miniapp/';
function qrstring(url, params) {
  let keys = Object.keys(params);
  let str = '';
  if (url.indexOf("?") == -1 && keys.length > 0) {
    str = '?';
    keys.map((item) => {
      str = str + "&" + item + "=" + params[item]
    })
  }
  return str;

}
function service({ formType, apiPrefix, url, method = 'get', params = {}, data = {}, header = {
  'content-type': 'application/json'
}, fromH5 = true}) {
  return new Promise((reslove, reject) => {
    apiPrefix = apiPrefixList[apiPrefix] || apiPrefixList.MHYQMINIAPP;
    var urlData = apiPrefix + url + qrstring(url, params);
    if (apiPrefix == 'https://test-swk-pay.kxtx.cn/webapp' && fromH5) {
      urlData += '&fromH5=1';
    }
    // debugger;
    // if (header["content-type"] =='x-www-form-urlencoded'){
    //   data = utils.json2Form(data);
    // }
    wx.request({
      url: urlData,
      header,
      
      method,
      data,
      formData,
      formType,
      complete: function (res) {

      },
      success: function (res) {
        if (res.errMsg == "request:ok") {
          if (res.data && res.data.data && utils.getType(res.data.data) == 'Object') {
            reslove(res.data);
          }
          else if (res.data && res.data.data && res.data.data.includes("{")) {
            res.data = {
              ...res.data,
              data: JSON.parse(res.data.data)
            }
            reslove(res.data);
          }else{
            reslove(res.data);
          }
       
        } else {
          reject(res);
        }
      }

    });
  })

}
module.exports = {
  service
}