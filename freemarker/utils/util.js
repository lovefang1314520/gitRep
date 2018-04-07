var config = require('../config/config.js');
function formatTime(date, split = '/', type = 'date') {
  date = new Date(date)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds();
  let aa = [year, month, day].join(split);
  let bb = [hour, minute, second].join(':');
  let dates = type == 'date' ? aa : aa + ' ' + bb;

  return dates;
  // + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function getType(value){
  return Object.prototype.toString.call(value).slice(8, -1);
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function formatDate(str) {
  var date = new Date(str.date);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  if (parseInt(month) < 10) {
    month = "0" + month;
  }
  if (parseInt(day) < 10) {
    day = "0" + day;
  }
  return year + "" + month;
}
function getRealImage(pro) {
  if (pro.thumbnail) {
    var image_src = "https://www.woaifruit.com" + '/v2/media/' + formatDate(pro.thumbnail) + '/' + pro.thumbnail._id + '/' + pro.thumbnail.fileName;
    return image_src;
  } else {
    return '';
  }


}
function timego(value) {
  var createDate = new Date(value).getTime();
  var second = 1000;
  var minute = second * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var cur = new Date().getTime();
  var dateMinus = (cur - createDate);
  if (dateMinus == 0 || (dateMinus / second > 0 && dateMinus / minute <= 1)) {
    return "刚刚";
  }
  if (dateMinus / minute > 1 && dateMinus / hour < 1) {
    return Math.floor(dateMinus / minute) + "分钟前";
  }
  if (dateMinus / hour > 1 && dateMinus / day < 1) {
    return Math.floor(dateMinus / hour) + "小时前";
  }
  if (dateMinus / day > 1 && dateMinus / day < 20) {
    return Math.floor(dateMinus / day) + "天前";
  } else {
    return formatTime(value);
  }
}


function obj2json(obj) {
  var str = "";
  for (var key in obj) {
    str = str + "&" + key + "=" + obj[key];
  }
  str = str.substr(1);
  return str;
}
function isReading(moduleName, itemId, userId) {
  const key = moduleName + "_" + itemId + "_" + userId;
  var _isReading = wx.getStorageSync(key) || false;
  return _isReading;
}
function setMoudleReading(moduleName, itemId, userId, val) {
  const key = moduleName + "_" + itemId + "_" + userId;
  var isReading = wx.getStorageSync(key) || false;
  wx.setStorageSync(key, val);
}
function getDeviceInfoPromise() {
  return new Promise(function (resolve, reject) {
    wx.getSystemInfo({
      success: function (res) {
        resolve(res);
      }
    })
  })
}

function getDeviceInfo() {
  let deviceInfo = wx.getStorageSync('deviceInfo') || '{}';
  if (deviceInfo == '{}') {
    return getDeviceInfoPromise().then((res) => {
      getApp().globalData.deviceInfo = res;
      wx.setStorageSync('deviceInfo', JSON.stringify(res));
    });
  } else {
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        deviceInfo = JSON.parse(deviceInfo);
        getApp().globalData.deviceInfo = deviceInfo;
        resolve();
      })
    });

  }
}
function json2Form(json) {

  var str = [];
  for (var p in json) {
   let type  = getType(json[p]);
   if(type=='Object'){
     let obj = {};
     for (let k in json[p]){
       obj[k] = json[p][k];
     }
     json[p] = obj;
   }
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));

  }

  return str.join("&");

}

module.exports = {
  formatTime,
  getType,
  json2Form,
  formatDate,
  timego,
  setMoudleReading,
  isReading,
  getDeviceInfo
}

